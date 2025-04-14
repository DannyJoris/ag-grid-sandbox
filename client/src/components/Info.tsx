import { useEffect, useState } from "react";
import { subscribeToInfoId } from "@/utils/openfin";
import codeMapping from "@/data/code-mapping.json";

interface WikiResponse {
  title: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  extract: string;
  type: string;
  lang: string;
  timestamp: string;
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

const Info = () => {
  const [info, setInfo] = useState<WikiResponse | null>(null);
  const [id, setId] = useState<string>('AAPL');

  useEffect(() => {
    // Subscribe to the info ID broadcast
    const unsubscribe = subscribeToInfoId((newId) => {
      console.log('Received info ID:', newId);
      setId(newId);
    });

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        console.log('Fetching info for ID:', id);
        const wikiStub = codeMapping[id as keyof typeof codeMapping] || id;
        console.log('Using Wikipedia stub:', wikiStub);
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiStub}`);
        const data = await response.json();
        setInfo(data);
      } catch (error) {
        console.error('Error fetching info:', error);
      }
    };
    fetchInfo();
  }, [id]);

  if (!info) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{info.title}</h1>
      <div className="mb-4">
        {info.thumbnail && (
          <img
            src={info.thumbnail.source}
            alt={info.title}
            width={info.thumbnail.width}
            height={info.thumbnail.height}
            className="w-[100px]"
          />
        )}
      </div>
      <p className="text-gray-700 mb-4">{info.extract}</p>
      <div className="text-sm text-gray-500 mb-4">
        <p>Type: {info.type}</p>
        <p>Language: {info.lang}</p>
        <p>Last Updated: {new Date(info.timestamp).toLocaleDateString()}</p>
        <p>Wikipedia Link: {info.content_urls.desktop.page}</p>
      </div>
    </div>
  );
};

export default Info;
