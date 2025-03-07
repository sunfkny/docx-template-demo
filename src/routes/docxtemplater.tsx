import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import printJS from 'print-js';
import { useState } from 'react';
import toast from 'react-hot-toast';

function loadFile(url: string, callback: (err: Error, data: string) => void) {
  PizZipUtils.getBinaryContent(url, callback);
}
function loadFileAsync(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    loadFile(url, (err, content) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(content);
      }
    });
  });
}

export const Route = createFileRoute('/docxtemplater')({
  component: RouteComponent,
});

function RouteComponent() {
  const [file, setFile] = useState(null as Blob | null);
  const [url, setUrl] = useState(undefined as string | undefined);

  async function generateDocument() {
    const content = await loadFileAsync('/tag-example.docx');

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.render({
      first_name: 'John',
      last_name: 'Doe',
      phone: '0652455478',
      description: 'New Website',
      products: [
        { name: 'Windows', price: 100 },
        { name: 'Mac OSX', price: 200 },
        { name: 'Ubuntu', price: 0 },
      ],
    });
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    setFile(out);
    const form = new FormData();
    form.append('fileInput', out, 'output.docx');
    // stirlingpdf api
    const res = await fetch('/api/v1/convert/file/pdf', {
      method: 'POST',
      body: form,
    });
    const pdf = await res.blob();
    const pdfUrl = URL.createObjectURL(pdf);
    setUrl(pdfUrl);
  }
  function downloadDocument() {
    if (!file) {
      toast.error('No file to download');
      return;
    }
    saveAs(file, 'output.docx');
  }
  function printDocument() {
    if (!file) {
      toast.error('No file to print');
      return;
    }
    printJS({ printable: url, type: 'pdf' });
  }

  return (
    <>
      {/* eslint-disable-next-line react-dom/no-missing-iframe-sandbox */}
      <iframe src={url} className="w-screen h-screen"></iframe>
      <div className="fixed right-4 bottom-4">
        <div className="flex gap-4">
          <Button onClick={generateDocument}>Generate</Button>
          <Button onClick={downloadDocument}>Download</Button>
          <Button onClick={printDocument}>Print</Button>
        </div>
      </div>
    </>
  );
}
