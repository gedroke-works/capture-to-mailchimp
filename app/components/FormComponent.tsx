"use client";
import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "url";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function FormComponent() {
  // Initialize state variables
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Initialize Router
  const router = useRouter();
  // Define the form data types.
  type FormData = {
    firstName: string;
    lastName: string;
    email: string;
  };

  // Create a form schema using the zod library.
  const formSchema = z.object({
    lastName: z
      .string()
      .min(2, "Veuillez entrer un nom digne de ce nom (2 caractères minimum) !")
      .max(
        20,
        "Nom démesuré, telle une ombre déchaîné. À 20 caractères, limitez-le sans hésiter !"
      ),
    firstName: z
      .string()
      .min(
        2,
        "Un prénom trop court, c'est bien trop banal. Offrez-nous un nom qui égale un régal!"
      )
      .max(
        15,
        "Prénom envoûtant, aux rimes chatoyantes. À 15 caractères, une harmonie éclatante et étincelante !"
      ),
    email: z
      .string()
      .email(
        "Email égaré, erreurs multipliées. Corrigez-le, suivez la voie éclairée!"
      ),
  });

  // Initialize the form with react-hook-form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
    },
  });
  // Helper function to capitalize the first character of each word
  const capitalizeWords = (text: string): string => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle form submission.
  const onSubmit = async (data: FormData): Promise<void> => {
    const { firstName, lastName, email }: FormData = data;

    try {
      console.log(formSubmitted);
      // Validate form data using Zod schema.
      formSchema.parse(data);

      // Check if the email already exists in the audience
      const checkResponse = await fetch(
        `/api/mailchimp/submit?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
        }
      );
      const { exists } = await checkResponse.json();

      if (exists) {
        form.setError("email", {
          message:
            "Votre email, dans les limbes égaré. Son existence est deja certifié.",
        });
        return;
      }
      // Create a new variable with formatted data
      const formattedData: FormData = {
        firstName: capitalizeWords(firstName),
        lastName: capitalizeWords(lastName),
        email: email.toLowerCase(),
      };

      // If the email doesn't exist yet, add the new member
      const response = await fetch("/api/mailchimp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData), // Use the modified data object instead.
      });

      if (response.ok) {
        // Reset the form state after successful submission
        form.reset();

        // Redirect to the thank-you page
        router.replace(
          format({
            pathname: "/thank-you",
            query: { fromForm: "true" },
          })
        );

        // Set the form submit variable to true because it is successful
        setFormSubmitted(true);

        console.log(formSubmitted);
      } else {
        throw new Error("Failed to add contact to the Mailchimp Audience");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten();
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            form.setError(field as keyof FormData, { message: messages[0] });
          }
        });
      } else if (
        error instanceof Error &&
        error.message.includes("looks fake or invalid")
      ) {
        form.setError("email", {
          message: "Invalid email address. Please enter a valid email.",
        });
      } else {
        // Handle other type of errors
        console.error("An error occurred:", error);
        throw new Error("An error occurred. Please try again.");
      }
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
                  className={`block w-full rounded-md border ${
                    form.formState.errors.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  } py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6`}
                />
              </FormControl>
              {form.formState.errors.lastName && (
                <FormMessage className="text-red-500">
                  {form.formState.errors.lastName.message}
                </FormMessage>
              )}
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
                  className={`block w-full rounded-md border ${
                    form.formState.errors.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  } py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6`}
                />
              </FormControl>
              {form.formState.errors.firstName && (
                <FormMessage className="text-red-500">
                  {form.formState.errors.firstName.message}
                </FormMessage>
              )}
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
                  className={`block w-full rounded-md border ${
                    form.formState.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6`}
                />
              </FormControl>
              {form.formState.errors.email && (
                <FormMessage className="text-red-500">
                  {form.formState.errors.email.message}
                </FormMessage>
              )}
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
