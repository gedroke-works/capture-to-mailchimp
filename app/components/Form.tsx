"use client";
import React from "react";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Form() {
  // useState setup.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Type Props.
  type SubmitProps = {
    firstName: string;
    lastName: string;
    email: string;
  };

  // Create a form schema : zod library.
  const formSchema = z.object({
    lastName: z.string().min(2).max(20),
    firstName: z.string().min(2).max(15),
    email: z.string().email(),
  });

  // 1. Define the form.
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { firstName, lastName, email }: SubmitProps = data;
    try {
      const response = await fetch("/api/mailchimp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      console.log(response);
      console.log(response.body);

      if (response.ok) {
        console.log("Contact added successfully to the Mailchimp Audience!");
      } else {
        console.log("Failed to add contact to the Mailchimp Audience");
        // Handle error cases if needed
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  // // 1. Define a form.
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     lastName: "",
  //     firstName: "",
  //     email: "",
  //   },
  // });

  // // 2. Define a submit handler.
  // const handleSubmit = async (data: z.infer<typeof formSchema>) => {
  //   const { firstName, lastName, email }: SubmitProps = {
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //   };
  //   try {
  //     const response = await fetch("/api/mailchimp/submit", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ firstName, lastName, email }),
  //     });

  //     if (response.ok) {
  //       console.log("Contact added successfully to the Mailchimp Audience!");
  //     } else {
  //       console.log("Failed to add contact to the Mailchimp Audience");
  //       // Handle error cases if needed
  //     }
  //   } catch (error) {
  //     console.log("An error occured:", error);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="firstName">First Name:</label>
      <input id="firstName" type="text" {...register("firstName")} required />

      <label htmlFor="lastName">Last Name:</label>
      <input id="lastName" type="text" {...register("lastName")} required />

      <label htmlFor="email">Email:</label>
      <input id="email" type="email" {...register("email")} required />

      <button type="submit">Submit</button>
    </form>
  );
}
