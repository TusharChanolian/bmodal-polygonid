import type { NextApiRequest, NextApiResponse } from "next";
import { Polybase } from "@polybase/client";
import { auth } from "@iden3/js-iden3-auth";

/**
 * API Route for generating a QR Code for the verification process.
 */
export default async function generateQrCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the session ID out of the request body.
  const { requestId } = req.body;

  const request = auth.createAuthorizationRequest(
    // Reason for the authorization request
    "Must be a Dao Hood",

    // Polygon ID of the requester
    process.env.NEXT_PUBLIC_SENDER_DID as string,

    `${
      process.env.NODE_ENV === "production" // Am I in production?
        ? process.env.NEXT_PUBLIC_PRODUCTION_URL // Yes, use production URL
        : process.env.NEXT_PUBLIC_DEVELOPMENT_URL // No, use development URL
    }/api/handle-verification?requestId=${requestId}` // To verify, use the handle-verification API route
  );

  request.id = requestId;
  request.thid = requestId;

  const scope = request.body.scope ?? [];
  request.body.scope = [
    ...scope,
       {
      id: 1,
      circuitId: 'credentialAtomicQuerySigV2',
      query: {
        allowedIssuers: ['*'],
        type: 'ProofOfDaoRole',
        context: 'https://raw.githubusercontent.com/0xPolygonID/tutorial-examples/main/credential-schema/schemas-examples/proof-of-dao-role/proof-of-dao-role.jsonld',
        credentialSubject: {
          "role": {
        "$in": [
          1,
          2,
          3,
          4,
          5
        ]
      }     
        },
      },
    }

  ];

  // Store the request in the Polybase database
  const db = new Polybase({
    defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE,
  });
  await db.collection("Requests").create([requestId, JSON.stringify(request)]);

  // Send the QR code back to the client.
  res.status(200).json({ request });
}
