'use client'
import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { projectsData } from '@/data/dataMainPortfolioEdit/projectsData';
import FolderGallery from '@/components/mainPortfolioFix/projects/FolderGallery';
import {FiSearch} from "react-icons/fi";
import ProjectsFilter from "@/components/mainPortfolioFix/projects/ProjectsFilter";
import ProjectSingle from "@/components/mainPortfolioFix/projects/ProjectSingle";
import ProjectsFilterCar from "@/components/mainPortfolioFix/projects/ProjectsFilterCar";

interface CarCardProps {
    projectId: string | undefined;
}

const CarCard: FC<CarCardProps> = ({ projectId }) => {
    const [searchProject, setSearchProject] = useState<string>('');
    const [selectProject, setSelectProject] = useState<string>('');
    const [currentProject, setCurrentProject] = useState<any | undefined>(undefined);

    useEffect(() => {
        // Знайти відповідний проект за projectId
        const project = projectsData.find(item => item.id.toString() === projectId);
        setCurrentProject(project);
    }, [projectId]);

    const searchProjectsById = currentProject ? [currentProject] : [];
    const selectProjectsByCategory = currentProject ? [currentProject] : [];

    const filteredProjects =
        selectProject !== '' ? selectProjectsByCategory : searchProjectsById;

    return (
        <section className=" container py-5 sm:py-10 mt-5 sm:mt-10">
            <div className="text-center">
                <p className="font-general-medium text-2xl sm:text-4xl mb-1 text-ternary-dark dark:text-ternary-light">
                    Projects portfolio
                </p>
            </div>

            <div className="mt-10 sm:mt-16">
                <h3 className="font-general-regular text-center text-secondary-dark dark:text-ternary-light text-md sm:text-xl mb-3">
                    Search projects by title or filter by category
                </h3>
                <div className="flex justify-between border-b border-primary-light dark:border-secondary-dark pb-3 gap-3">
                    <div className="flex justify-between gap-2">
            <span className="hidden sm:block bg-primary-light dark:bg-ternary-dark p-2.5 shadow-sm rounded-xl cursor-pointer">
              <FiSearch className="text-ternary-dark dark:text-ternary-light w-5 h-5"></FiSearch>
            </span>
                        <input
                            onChange={(e) => {
                                setSearchProject(e.target.value);
                            }}
                            className="font-general-medium pl-3 pr-1 sm:px-4 py-2 border border-gray-200 dark:border-secondary-dark rounded-lg text-sm sm:text-md bg-secondary-light dark:bg-ternary-dark text-primary-dark dark:text-ternary-light"
                            id="name"
                            name="name"
                            type="search"
                            required
                            placeholder="Search Projects"
                            aria-label="Name"
                        />
                    </div>

                    <ProjectsFilterCar setSelectProject={setSelectProject} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-5">
                {filteredProjects.map((project) => (
                    <FolderGallery key={project.id} {...project} img={project.cars} />
                ))}
            </div>
        </section>

    );
};

export default CarCard;
