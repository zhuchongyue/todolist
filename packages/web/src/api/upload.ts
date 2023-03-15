
import request from "./request";

export async function upload(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<{url: string}>('/upload', formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

export async function download(url: string, filename: string) {
  return request.get(url, {responseType: 'blob'}).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  });
}