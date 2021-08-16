import { Stream } from "stream";

export interface file {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
