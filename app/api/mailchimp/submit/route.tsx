import { NextResponse } from "next/server";

// This is responsible for importing mailchimp methods and creating a client instance for every request.
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
  apiKey: process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY,
  server: process.env.NEXT_PUBLIC_MAILCHIMP_API_SERVER,
});
// This is the variable that will be used for our requests.
const list_id = process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID;

// This is a GET request that will ping the server and return the response.
export async function GET() {
  try {
    const response = await mailchimp.ping.get();
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 405 });
  }
}

// This is a POST request that will add a new subscriber to the list using Mailchimp Methods.
export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not Allowed" }, { status: 405 });
  }

  try {
    const { firstName, lastName, email } = await request.json();

    const response = await mailchimp.lists.addListMember(list_id, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

// This will have a PUT request that will add or update a subscriber to the list using Mailchimp Methods
