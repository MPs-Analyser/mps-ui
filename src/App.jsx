import { useState, useEffect, useRef } from "react";

import NavBar from "./NavBar";
import DivisionDetails from "./DivisionDetails";
import Parties from "./Parties";
import Search from "./Search";
import Insights from "./Insights";
import Browse from "./Browse";
import Toast from "./Toast";

import ky from 'ky-universal';

import { config } from '../src/app.config';

const EARLIEST_FROM_DATE = "2003-11-12";

import "./styles/index.css";
import "./styles/utils.css";

const App = () => {

	const [page, setPage] = useState("home");
	const [mpDetails, setMpDetails] = useState({});
	const [divisionDetails, setDivisionDetails] = useState({});
	const [votingSummary, setVotingSummary] = useState({});

	const [filterInProgress, setFilterInProgress] = useState(false);

	const [globalMessage, setGlobalMessage] = useState({
		text: undefined,
		type: undefined,
	});

	const container = useRef(null);

	useEffect(() => {
		console.log("render APP ");
		const theme = localStorage.getItem("theme");
		theme && document.body.classList.add(theme);
	}, []);

	const handleThemeToggle = () => {
		document.body.classList.toggle("light-mode");
		if (document.body.classList.contains("light-mode")) {
			localStorage.setItem("theme", "light-mode");
		} else {
			localStorage.removeItem("theme");
			document.body.removeAttribute("class");
		}
	};

	const onHandleError = (message) => {
		setGlobalMessage(message);
	};

	const onToggleSearchBar = () => {
		container.current.scrollTo(0, 0);
		document.querySelector(".wrapper input").focus();
	};

	const onGetVotingSummary = async (id, fromDate = EARLIEST_FROM_DATE, toDate, divisionCategory = "Any", name= "Any") => {

		setFilterInProgress(true);

		if (!toDate) {
			toDate = new Date().toISOString().substr(0, 10);
		}

		const result = await ky(`${config.mpsApiUrl}votecounts?id=${id}&fromDate=${fromDate}&toDate=${toDate}&category=${divisionCategory}&name=${name}`).json();
		console.log('votecounts ', result);

		setFilterInProgress(false);
		setVotingSummary(result);
	}

	const onQueryMp = async (id) => {

		setPage('home');

		setMpDetails(undefined);
		setDivisionDetails(undefined);

		const result = await ky(`https://members-api.parliament.uk/api/Members/${id}`).json();

		setMpDetails(result);

		onGetVotingSummary(result?.value?.id);

	}

	const onQueryDivision = async (id) => {

		setPage('home');

		setMpDetails(undefined);
		setDivisionDetails(undefined);

		const result = await ky(`https://commonsvotes-api.parliament.uk/data/division/${id}.json`).json();

		setDivisionDetails(result)
	}

	return (
		<main>
			<NavBar
				setPage={setPage}
				handleThemeToggle={handleThemeToggle}
				onToggleSearchBar={onToggleSearchBar}
			/>

			<div className='container' ref={container}>
			
				{page === "home" && (
					<>
						<Search
							setGlobalMessage={setGlobalMessage}
							mpDetails={mpDetails}
							setMpDetails={setMpDetails}
							divisionDetails={divisionDetails}
							setDivisionDetails={setDivisionDetails}
							votingSummary={votingSummary}
							setVotingSummary={setVotingSummary}
							onGetVotingSummary={onGetVotingSummary}
							onQueryMp={onQueryMp}
							onQueryDivision={onQueryDivision}
							filterInProgress={filterInProgress}
							setFilterInProgress={setFilterInProgress}
						/>
					</>
				)}

				{page === "insights" && (
					<Insights
						setGlobalMessage={setGlobalMessage}
						onQueryDivision={onQueryDivision}
						onQueryMp={onQueryMp}
					/>
				)}

				{page === "browse" && (
					<Browse
						setGlobalMessage={setGlobalMessage}
						onQueryDivision={onQueryDivision}
						onQueryMp={onQueryMp}
					/>
				)}

				{page === "divison" && (
					<DivisionDetails
						onHandleError={onHandleError}
					/>
				)}				

				{page === "parties" && <Parties />}

				{globalMessage.type && <Toast message={globalMessage} />}
			</div>
		</main>
	);
};

export default App;
