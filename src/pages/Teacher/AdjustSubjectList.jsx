import { useEffect } from "react";

export default function AdjustSubjectList() {
	useEffect(() => {
		document.title = "check";
	}, []);
		
	return (
		<div className="w-10 h-10 bg-blue-500">
			<h1>Hi chat</h1>
		</div>
	);
}
