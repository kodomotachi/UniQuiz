import NavBar from "../components/NavBar/NavBar";

export default function TeacherDashboard() {
	return (
		<>
			<NavBar />
			<div className="flex items-center justify-center h-screen">
				<div className="flex items-center justify-center border border-gray-400 bg-white rounded-xl px-10 py-2 shadow-md w-full h-[500px] mx-[30px]">
					<div className="grid grid-cols-5 gap-4">
						<button className="w-[300px] h-[60px] bg-sky-500 rounded hover:ring-4 hover:ring-black transition duration-200 outline-none">
							Adjust subject list
						</button>	
						<button className="w-[300px] h-[60px] bg-sky-500 rounded hover:ring-4 hover:ring-black transition duration-200 outline-none">
							Adjust student list
						</button>	
						<button className="w-[300px] h-[60px] bg-sky-500 rounded hover:ring-4 hover:ring-black transition duration-200 outline-none">
							Adjust teacher list
						</button>	
						<button className="w-[300px] h-[60px] bg-sky-500 rounded hover:ring-4 hover:ring-black transition duration-200 outline-none">
							Adjust question list
						</button>	
						<button className="w-[300px] h-[60px] bg-sky-500 rounded hover:ring-4 hover:ring-black transition duration-200 outline-none">
							Prepare examination
						</button>	
					</div>
				</div>
			</div>
		</>
	);
}	