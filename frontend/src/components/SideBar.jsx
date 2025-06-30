import { AiOutlineGithub } from "react-icons/ai"; 
import { CgPathIntersect } from "react-icons/cg"; 
import { TbBrandGoogleAnalytics } from "react-icons/tb"; 
import { CgCalculator } from "react-icons/cg"; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
    const [open, setOpen] = useState(false);
    return (
        <nav 
            className={`main-menu transition-all duration-300 ${open ? 'w-[250px]' : 'w-[60px]'} overflow-visible`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <ul>
                <li className={`text-lg border-b transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-lg">
                        Pages
                    </span>
                </li>
                <li>
                    <Link to="/CombinatorialAnalyzer">
                        <TbBrandGoogleAnalytics className="fa fa-2x"/>
                        <span className={`nav-text text-lg transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
                            Combinatorial Analyzer
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <CgCalculator className="fa fa-2x"/>
                        <span className={`nav-text text-lg transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
                            Binominal Calcolator
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to="/pathfinding">
                        <CgPathIntersect className="fa fa-2x"/>
                        <span className={`nav-text text-lg transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
                            Path Finding
                        </span>
                    </Link>
                </li>
                <li className={`text-lg border-b transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-lg">
                        Links
                    </span>
                </li>
                <li>
                    <Link hrefLang="">
                        <AiOutlineGithub className="fa fa-2x"/>
                        <span className={`nav-text text-lg transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
                            Github Repo
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default SideBar;