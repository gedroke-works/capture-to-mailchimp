"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function FormComponent() {
  // Type Props.
  type FormData = {
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

  // 1. Define a form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: FormData): Promise<void> => {
    const { firstName, lastName, email }: FormData = data;
    try {
      const response = await fetch("/api/mailchimp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      if (response.ok) {
        console.log("Contact added successfully to the Mailchimp Audience!");
      } else {
        console.log("Failed to add contact to the Mailchimp Audience");
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                  Nom
                </FormLabel>
              </div>

              <FormControl className="mt-2">
                <Input
                  placeholder="Entrez votre nom..."
                  {...field}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                  Prénom
                </FormLabel>
              </div>
              <FormControl className="mt-2">
                <Input
                  placeholder="Entrez votre prénom..."
                  {...field}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </FormLabel>
              </div>

              <FormControl>
                <Input
                  placeholder="Entrez votre adresse email..."
                  {...field}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="flex w-full justify-center rounded-md bg-slate-700 px-3 py-1.5 text-m font-semibold leading-6 text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
        >
          Submit
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Nous nous soumettons à la reglementation RGPD de la protection des
        données et de confidentialité.{" "}
      </p>
    </Form>
  );
}

// <form onSubmit={handleSubmit(onSubmit)}>
//   <label htmlFor="firstName">First Name:</label>
//   <input id="firstName" type="text" {...register("firstName")} required />

//   <label htmlFor="lastName">Last Name:</label>
//   <input id="lastName" type="text" {...register("lastName")} required />

//   <label htmlFor="email">Email:</label>
//   <input id="email" type="email" {...register("email")} required />

//   <button type="submit">Submit</button>
// </form>

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
//   const { firstName, lastName, email }: FormData = {
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
