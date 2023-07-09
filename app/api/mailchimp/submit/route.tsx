import { NextResponse, NextRequest } from "next/server";

// This is responsible for importing mailchimp methods and creating a client instance for every request.
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
  apiKey: process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY,
  server: process.env.NEXT_PUBLIC_MAILCHIMP_API_SERVER,
});
// This is the variable that will be used for our requests.
const list_id = process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID;

// This is a GET request that will ping the server and return the response.
export async function GET(request: Request) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method not Allowed" }, { status: 405 });
  }

  // Retrieve the email input.
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  // Check if email parameter is valid
  if (!email) {
    return NextResponse.json(
      { error: "Invalid email parameter" },
      { status: 400 }
    );
  }

  try {
    const response = await mailchimp.lists.getListMember(list_id, email);

    if (response.status === 404) {
      return NextResponse.json({ exists: false }, { status: 200 });
    } else {
      return NextResponse.json({ exists: true }, { status: 200 });
    }
  } catch (error) {
    if ((error as any).status === 404) {
      return NextResponse.json({ exists: false }, { status: 200 });
    } else {
      console.log(error);
      return NextResponse.json(
        { exists: false, error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

// This is a POST request that will add a new subscriber to the list using Mailchimp Methods.
export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not Allowed" }, { status: 405 });
  }

  try {
    const { firstName, lastName, email } = await request.json();

    // Submit the form data to Mailchimp
    const response = await mailchimp.lists.addListMember(list_id, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    });

    // Redirect to the thank-you page

    // Return a response
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
