import type { UserDB } from "../../db/schema";
import {
  getFileURL,
  getUploadFileURL,
} from "@backend/lib/storage/aws-s3";

export async function getPictureUploadURL(user: UserDB) {
  return {
    uploadURL: await getUploadFileURL(
      ["User", user.id.toString(), "photo"],
      true,
    ),
    url: getFileURL(["User", user.id.toString(), "photo"]),
  };
}
