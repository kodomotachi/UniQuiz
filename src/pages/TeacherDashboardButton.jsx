import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function TeacherDashboardButton() {
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		try {
			const token = localStorage.getItem('token');
			if(token) {
				const decodedToken = jwtDecode(token);
				if (decodedToken.id === 'admin') {
					setIsAdmin(true);
				}
			}
		} catch (error) {
			console.error("Failed to decode token", error);
			setIsAdmin(false);
		}
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-fit">
			<div className="my-[100px]">
				<p className="text-2xl font-semibold">
					Teacher Dashboard
				</p>
			</div>
			<div className="flex items-center justify-center border border-gray-400 bg-white rounded-xl px-10 py-2 shadow-md w-auto h-[500px] mx-[30px]">
				<div className="flex flex-wrap items-center justify-center gap-4">
					<Link to="adjust-subject-list">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded shadow-md hover:shadow-2xl transition-all duration-300 hover:bg-sky-600 ease-in-out outline-none text-white font-medium">
							Adjust subject list
						</button>	
					</Link>
					<Link to="adjust-student-list">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded shadow-md hover:shadow-2xl transition-all duration-300 hover:bg-sky-600 ease-in-out outline-none text-white font-medium">
							Adjust student list
						</button>	
					</Link>
					{isAdmin && (
						<Link to="adjust-teacher-list">
							<button className="w-[250px] h-[60px] bg-sky-500 rounded shadow-md hover:shadow-2xl transition-all duration-300 hover:bg-sky-600 ease-in-out outline-none text-white font-medium">
								Adjust teacher list
							</button>	
						</Link>	
					)}
					<Link to="adjust-question-list">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded shadow-md hover:shadow-2xl transition-all duration-300 hover:bg-sky-600 ease-in-out outline-none text-white font-medium">
							Adjust question list
						</button>	
					</Link>
					<Link to="prepare-examination">
						<button className="w-[250px] h-[60px] bg-sky-500 rounded shadow-md hover:shadow-2xl transition-all duration-300 hover:bg-sky-600 ease-in-out outline-none text-white font-medium">
							Prepare examination
						</button>
					</Link>
				</div>
			</div>
		</div>		
	);
}