import { Kafka } from "kafkajs";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();
export const startSendMailConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: "mail-service",
      brokers: [process.env.Kafka_Broker || "localhost:9092"],
    });

   const consumer = kafka.consumer({ groupId: "mail-service-group" });

await consumer.connect();

const topicName = "send-mail";

await consumer.subscribe({ topic: topicName, fromBeginning: false });

console.log("✅ Mail service consumer started, listening for sending mail");

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    try {
      const { to, subject, html } = JSON.parse(
        message.value?.toString() || "{}"
      );

      //make transporter
      const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:process.env.SMTP_User,
            pass:process.env.SMTP_Pass,
        },
      });

      await transporter.sendMail({
        from:"HireIn <no-reply>",
        to,
        subject,
        html,
      })

      console.log(`Mail has been sent to ${to}`);
    } catch (error) {
        console.log("failed to send mail",error);
    }
  },
});
  } catch (error) {
    console.log("failed to start Kafka consumer",error);
  }
};