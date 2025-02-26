
import { FileList } from "./file-list";
import { UploadButton } from "./ui/upload-button";

export const Files = () => {
  return (
    <div className="p-4 w-80 flex flex-col h-full gap-4">
      <FileList />
      <UploadButton />
    </div>
  );
};
