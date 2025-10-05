import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if (postcode.length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  /** TODO(FINISHED): Implement the validation logic to ensure input value
   *  is all digits and non negative
   */
  const isStrictlyNumeric = (value: string) => {
    return /^[0-9]+$/.test(value);
  };

  /** TODO(FINISHED): Refactor the code below so there is no duplication of logic for postCode/streetNumber digit checks. */

  const checkNumericField = (value: string, field: string) => {
    if (!isStrictlyNumeric(value)) {
      return `${field} must be all digits and non negative!`;
    }
    return null;
  };

  const postcodeError = checkNumericField(postcode as string, "Postcode");
  const streetNumberError = checkNumericField(streetnumber as string, "Street Number");

  if (postcodeError) {
    return res.status(400).send({ status: "error", errormessage: postcodeError });
  }

  if (streetNumberError) {
    return res.status(400).send({ status: "error", errormessage: streetNumberError });
  }

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
