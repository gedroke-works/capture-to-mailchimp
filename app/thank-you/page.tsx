"use client";
import React from "react";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const TITLE_TEXT = "Votre inscription est un succès !";
const SUBTITLE_TEXT =
  "Un email vous sera envoyé dans votre boite de reception !";
const DESCRIPTION_TEXT =
  "Faites en sortes de verifier dans votre boite spam si vous ne trouvez pas l'email et de";
const WHITELIST_TEXT = "whitelist";
const MISSING_TEXT = "être sûr de ne rien manquer !";
const PRIMARY_BUTTON_TEXT = "Vers Gmail";
const SECONDARY_BUTTON_TEXT = "Vers Outlook";
const PRIMARY_BUTTON_LINK = "https://mail.google.com";
const SECONDARY_BUTTON_LINK = "https://outlook.live.com";

export default function ThankYouPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromForm = searchParams.get("fromForm");

    if (!fromForm) {
      console.log("Redirecting to the form page...");
      router.replace("/");
    } else {
      console.log(
        'Thank-you page loaded with "fromForm" query parameter:',
        fromForm
      );
    }
  }, [pathname, searchParams, router]);
  return (
    <>
      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {TITLE_TEXT}
              <br />
              {SUBTITLE_TEXT}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              {DESCRIPTION_TEXT} <em>{WHITELIST_TEXT}</em> {MISSING_TEXT}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href={PRIMARY_BUTTON_LINK}
                className="rounded-md bg-rose-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              >
                {PRIMARY_BUTTON_TEXT}
              </a>
              <a
                href={SECONDARY_BUTTON_LINK}
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {SECONDARY_BUTTON_TEXT}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
