import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    const authorization_token = localStorage.getItem("authorization_token");

    try {
      // Get the presigned URL
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent((file as any)?.name),
        },
        headers: { Authorization: `Basic ${authorization_token}` },
      });
      console.log("File to upload: ", (file as any)?.name);
      console.log("Uploading to: ", response.data?.url);
      const result = await fetch(response.data?.url, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      // setFile("");
    } catch (error) {
      console.error('ERROR: ', error);
      const errorResponse = (error as AxiosError)?.response;
      if (errorResponse) {
        const status = errorResponse.status;

        if (status === 400) {
          alert((errorResponse.data as any)?.data);
        }
        if (status === 403 || status === 401) {
          alert((errorResponse.data as any)?.message);
        }
      }
      return Promise.reject(error);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
