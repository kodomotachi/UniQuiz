import { useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function TeacherDashboard() {
	const navigate = useNavigate();
	useEffect(() => {
		document.title = "Teacher dashboard";

		// Kiểm tra token
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/signin', { replace: true });
			return;
		}
		try {
			const decoded = jwtDecode(token);
			if (decoded.exp && Date.now() >= decoded.exp * 1000) {
				localStorage.removeItem('token');
				navigate('/signin', { replace: true });
			}
		} catch (e) {
			localStorage.removeItem('token');
			navigate('/signin', { replace: true });
		}
	}, [navigate]);

	return (
		<>
			<NavBar />
			<div className="min-h-[calc(100vh-64px)]">
				<Outlet />
			</div>
		</>
	);
}