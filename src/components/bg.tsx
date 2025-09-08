export function Bg() {
  return (
    <div>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-radial from-blue-500/3 to-transparent rounded-full"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
    </div>
  );
}
