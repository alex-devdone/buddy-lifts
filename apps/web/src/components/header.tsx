"use client";

import { Dumbbell, Newspaper, Users } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const links = [
		{ to: "/trainings", label: "Trainings", icon: Dumbbell },
		{ to: "/feed", label: "Feed", icon: Newspaper },
		{ to: "/friends", label: "Friends", icon: Users },
	] as const;

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-4 py-3 md:px-6">
				<nav className="flex gap-4 text-sm md:gap-6 md:text-base">
					{links.map(({ to, label, icon: Icon }) => {
						return (
							<Link
								key={to}
								href={to}
								className="flex items-center gap-1.5 transition-colors hover:text-primary"
							>
								<Icon className="h-4 w-4" />
								<span>{label}</span>
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
			<hr />
		</div>
	);
}
