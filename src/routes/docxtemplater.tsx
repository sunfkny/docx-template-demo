import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import { renderAsync } from 'docx-preview';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { useEffect, useRef, useState } from 'react';
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
  const container = useRef(null as HTMLDivElement | null);

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
    }); // Output the document using Data-URI
    setFile(out);
    await renderAsync(out, container.current!);
  }
  function downloadDocument() {
    if (!file) {
      toast.error('No file to download');
      return;
    }
    saveAs(file, 'output.docx');
  }

  useEffect(() => {
    generateDocument();
  }, []);

  return (
    <>
      <div ref={container}></div>
      <Button onClick={downloadDocument} className="fixed right-4 bottom-4">Download</Button>
    </>
  );
}
