import axios, { AxiosProgressEvent } from "axios";

export const BASE_URL = "https://nodejs-production-d538.up.railway.app";

const getSignedUrl = (
  file: File,
  onSuccess: (data: { url: string; assetId: string }) => void,
  onFailure: () => void
) => {
  axios
    .post(`${BASE_URL}/api/aws`, {
      key: file.name,
      contentType: file.type,
    })
    .then((response) => {
      onSuccess({
        url: response.data.url,
        assetId: response.data.accessURL,
      });
    })
    .catch(() => {
      onFailure();
    });
};

export const triggerGenerateTranscript = (
  assetId?: string,
  tag?: string,
  size?: number,
  onSuccess?: () => void,
  onFailure?: () => void
) => {
  axios
    .post(`${BASE_URL}/api/transcript`, {
      url: assetId,
      category: tag,
      size,
    })
    .then(onSuccess)
    .catch(onFailure);
};

const uploadFile = ({
  file,
  onUploadFailure,
  onUploadProgress,
  onUploadSuccess,
}: {
  file: File;
  onUploadProgress: (percent: number) => void;
  onUploadSuccess: (data: { assetId: string }) => void;
  onUploadFailure: () => void;
}) => {
  const controller = new AbortController();
  getSignedUrl(
    file,
    ({ assetId, url }) => {
      const formData = new FormData();
      formData.append("file", file);
      axios
        .put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
          signal: controller.signal,
          onUploadProgress: (event: AxiosProgressEvent) => {
            onUploadProgress((event.progress || 0) * 100);
          },
        })
        .then(() => {
          onUploadSuccess({ assetId });
        })
        .catch(() => {
          onUploadFailure();
        });
    },
    () => {
      onUploadFailure();
    }
  );

  return {
    cancelUpload: () => controller.abort(),
  };
};

export const uploadFiles = ({
  files,
  onUploadFailure,
  onUploadProgress,
  onUploadSuccess,
}: {
  files: { id: string; file: File }[];
  onUploadProgress: (id: string, percent: number) => void;
  onUploadSuccess: (id: string, data: { assetId: string }) => void;
  onUploadFailure: (id: string) => void;
}) => {
  const cancelUploadCbs: Record<string, () => void> = {};
  files.forEach(({ id, file }) => {
    const { cancelUpload } = uploadFile({
      file,
      onUploadFailure: onUploadFailure.bind(null, id),
      onUploadProgress: onUploadProgress.bind(null, id),
      onUploadSuccess: onUploadSuccess.bind(null, id),
    });
    cancelUploadCbs[id] = cancelUpload;
  });
  return {
    cancelUpload: (id: string) => cancelUploadCbs[id]?.(),
  };
};
