import { Link } from "react-router-dom";

export default function TeacherDashboardButton() {
	return (
		<div className="flex flex-col items-center justify-center min-h-fit">
			<div className="my-[100px]">
				<p className="text-2xl font-semibold">
					Teacher Dashboard
				</p>
			</div>
			<div className="flex items-center justify-center border border-gray-400 bg-white rounded-xl px-10 py-2 shadow-md w-400 h-[500px] mx-[30px]">
				<div className="grid grid-cols-5 gap-4">
					<Link to="/teacher-dashboard/adjust-subject-list">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded hover:ring-2 hover:ring-black transition duration-200 outline-none">
							Adjust subject list
						</button>	
					</Link>
					<Link to="/teacher-dashboard/adjust-student-list">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded hover:ring-2 hover:ring-black transition duration-200 outline-none">
							Adjust student list
						</button>	
					</Link>
					<Link to="/teacher-dashboard/adjust-teacher-list">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded hover:ring-2 hover:ring-black transition duration-200 outline-none">
							Adjust teacher list
						</button>	
					</Link>	
					<Link to="/teacher-dashboard/adjust-question-list">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded hover:ring-2 hover:ring-black transition duration-200 outline-none">
							Adjust question list
						</button>	
					</Link>
					<Link to="/teacher-dashboard/prepare-examination">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded hover:ring-2 hover:ring-black transition duration-200 outline-none">
							Prepare examination
						</button>
					</Link>
				</div>
			</div>
		</div>		
	);
}