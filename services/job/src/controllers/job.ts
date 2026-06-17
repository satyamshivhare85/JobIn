import axios from "axios";
import { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

export const createCompany = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler(401, "Authentication required");
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler(403, "Only recruiters can create companies");
    }

    const { name, description, website } = req.body;

    if (!name || !description || !website) {
      throw new ErrorHandler(400, "All fields are required");
    }

    const existingCompanies = await sql`
      SELECT company_id
      FROM companies
      WHERE LOWER(name) = LOWER(${name.trim()})
    `;

    if (existingCompanies.length > 0) {
      throw new ErrorHandler(
        409,
        `A company with the name '${name}' already exists`
      );
    }

    const file = req.file;

    if (!file) {
      throw new ErrorHandler(400, "Company logo is required");
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer?.content) {
      throw new ErrorHandler(500, "Failed to create file buffer");
    }

 

    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      {
        buffer: fileBuffer.content,
      }
    );

    const [newCompany] = await sql`
      INSERT INTO companies (
        name,
        description,
        website,
        logo,
        logo_public_id,
        recruiter_id
      )
      VALUES (
        ${name.trim()},
        ${description.trim()},
        ${website.trim()},
        ${data.url},
        ${data.public_id},
        ${user.user_id}
      )
      RETURNING *
    `;

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company: newCompany,
    });
  }
);


export const deleteCOmpany =TryCatch(
    async(req:AuthenticatedRequest,res)=>{
        const user=req.user;
        const{companyId}=req.params;

        const[company]=
        await sql`SELECT logo_public_id FROM companies WHERE company_id=${companyId} AND recruiter_id=${user?.user_id}`;

        if(!company){
            throw new ErrorHandler(404,"company not found or you are not authorized to delete it")
        }
         await sql`DELETE FROM companies WHERE company_id=${companyId}`;

         res.json({
            message:"Company and all associated jobs have been deleted",
         })
    }
)


export const createJob = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler(401, "Authentication required");
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler(403, "Only recruiters can create jobs");
    }

    const {
      title,
      description,
      salary,
      location,
      role,
      job_type,
      work_location,
      company_id,
      openings,
    } = req.body;

    if (
      !title ||
      !description ||
      !salary ||
      !location ||
      !role ||
      !job_type ||
      !work_location ||
      !company_id ||
      !openings
    ) {
      throw new ErrorHandler(400, "All fields are required");
    }

    const [company] = await sql`
      SELECT company_id
      FROM companies
      WHERE company_id = ${company_id}
      AND recruiter_id = ${user.user_id}
    `;

    if (!company) {
      throw new ErrorHandler(
        404,
        "Company not found or does not belong to this recruiter"
      );
    }

    const [newJob] = await sql`
      INSERT INTO jobs (
        title,
        description,
        salary,
        location,
        role,
        job_type,
        work_location,
        company_id,
        posted_by_recruiter_id,
        openings
      )
      VALUES (
        ${title},
        ${description},
        ${salary},
        ${location},
        ${role},
        ${job_type},
        ${work_location},
        ${company_id},
        ${user.user_id},
        ${openings}
      )
      RETURNING *
    `;

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });
  }
);

export const updateJob = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler(401, "Authentication required");
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler(403, "Only recruiters can update jobs");
    }

    const jobId = Number(req.params.jobId);

    console.log("Job ID:", jobId);
    console.log("User ID:", user.user_id);

    if (isNaN(jobId)) {
      throw new ErrorHandler(400, "Invalid job ID");
    }

    const {
      title,
      description,
      salary,
      location,
      role,
      job_type,
      work_location,
      openings,
      is_active,
    } = req.body;

    const [existingJob] = await sql`
      SELECT *
      FROM jobs
      WHERE job_id = ${jobId}
    `;

    console.log("Existing Job:", existingJob);

    if (!existingJob) {
      throw new ErrorHandler(404, "Job not found");
    }

    if (Number(existingJob.posted_by_recruiter_id) !== Number(user.user_id)) {
      throw new ErrorHandler(
        403,
        "Forbidden: You are not allowed to update this job"
      );
    }

    const [updatedJob] = await sql`
      UPDATE jobs
      SET
        title = ${title ?? existingJob.title},
        description = ${description ?? existingJob.description},
        salary = ${salary ?? existingJob.salary},
        location = ${location ?? existingJob.location},
        role = ${role ?? existingJob.role},
        job_type = ${job_type ?? existingJob.job_type},
        work_location = ${work_location ?? existingJob.work_location},
        openings = ${openings ?? existingJob.openings},
        is_active = ${is_active ?? existingJob.is_active}
      WHERE job_id = ${jobId}
      RETURNING *
    `;

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  }
);


export const getAllCompany =TryCatch(async(req:AuthenticatedRequest,res)=>{
  const companies =await sql`
  SELECT * FROM companies WHERE recruiter_id =${req.user?.user_id}`;
  res.json(companies);
})

export const getCompanyDetails = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    if (!id) {
      throw new ErrorHandler(400, "Company id is required");
    }

   const [companyData] = await sql`SELECT c.*, COALESCE (
  (
    SELECT json_agg(j.*) FROM jobs j WHERE j.company_id = c.company_id
  ),
  '[]'::json
) AS jobs
FROM companies c WHERE c.company_id = ${id} GROUP BY c.company_id;`;

if (!companyData) {
  throw new ErrorHandler(404, "Company not found");
}

res.json(companyData);
  }
);


export const getAllActiveJobs = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { title, location } = req.query as {
      title?: string;
      location?: string;
    };

    let querySting = `SELECT j.job_id, j.title, j.description, j.salary, j.
    location, j.job_type, j.role, j.work_location, j.created_at, c.name AS
    company_name, c.logo AS company_logo, c.company_id AS company_id FROM jobs j
    JOIN companies c ON j.company_id = c.company_id WHERE j.is_active = true`;
  
  const values=[];

  let paramIndex=1;
if (title) {
  querySting += ` AND j.title ILIKE $${paramIndex}`;
  values.push(`%${title}%`);
  paramIndex++;
}

if (location) {
  querySting += ` AND j.location ILIKE $${paramIndex}`;
  values.push(`%${location}%`);
  paramIndex++;
}

querySting += " ORDER BY j.created_at DESC";

const jobs = (await sql.query(querySting, values)) as any[];

res.json(jobs);
}
);