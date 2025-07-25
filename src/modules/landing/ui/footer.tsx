import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="h-12 w-full">
      <div className="lg:px-0 px-4 flex h-full mx-auto max-w-4xl w-full justify-between items-center">
        <div>© 2025 Ngerti.In. All rights reserved.</div>
        <div>
          <Link href={"https://github.com/HeraldoArman/ngerti-in"}>
            <FaGithub />
          </Link>
        </div>
      </div>
    </footer>
  );
}
