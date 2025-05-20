import { useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import { Link, Outlet } from "react-router-dom";

export default function TeacherDashboard() {
	useEffect(() => {
		document.title = "Teacher dashboard";
	}, []);	

	return (
		<>
			<NavBar />
			<div className="min-h-[calc(100vh-64px)]">
				<Outlet />
			</div>
		</>
	);
}