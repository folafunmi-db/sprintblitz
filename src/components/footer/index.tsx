import { Github } from "lucide-react";

const Footer = () => {
  return (
    <div className="text-sm top-[100vh] flex  justify-center items-center gap-1 sticky mb-2">
      © {new Date().getFullYear()} Sprintblitz.
      <a
        href="https://github.com/folafunmi-db"
        rel="noreferrer noopener"
        className="flex justify-center items-center gap-1 text-sm"
      >
        <Github width={14} height={14} />
      </a>
    </div>
  );
};

export default Footer;
