export default function Footer() {
  return (
    <footer className="bg-[#8879AD] text-white py-4 mt-10">
      <div className="max-w-7xl mx-auto text-center text-sm">
        <p>
          © {new Date().getFullYear()} MyTherapy | Designed with 💜 by Team
        </p>
        <p className="text-[#EB9FBF] mt-1">
          Empowering Therapists. Enhancing Care.
        </p>
      </div>
    </footer>
  );
}
