import { useState, useEffect, useRef } from "react";

import NavBar from "./NavBar";
import DivisionDetails from "./DivisionDetails";
import PartiesPage from "./PartiesPage";
import DonarsPage from "./DonarsPage";
import DonarDetailsPage from "./DonarDetailsPage";
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
	const [partyDonations, setPartyDonations] = useState({});	

	const [donarDetails, setDonarDetails] = useState([]);
	const [donarHeader, setDonarHeader] = useState([]);

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

	const onGetVotingSummary = async (id, fromDate = EARLIEST_FROM_DATE, toDate, divisionCategory = "Any", name = "Any") => {

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

	const onQueryPartyDonars = async (i) => {
		setPage('donars');
		const donationsResponse = await ky(`${config.mpsApiUrl}donations?partyname=${i}`).json();
		setPartyDonations(donationsResponse);		
	}

	const onSearchDonarNames = async (value) => {
		setPage('donarDetails');
		const donationsResponse = await ky(`${config.mpsApiUrl}donations?donar=${value}`).json();

		const headerResult = {
			donar: value,			
			totals: {}
		};

		setDonarHeader(headerResult);
		setDonarDetails(donationsResponse);
	}

	const onQueryDonar = async (donar, amount) => {
		console.log("query donar ", donar, amount);
		setPage("donarDetails")
		const result = await ky(`${config.mpsApiUrl}donations?donar=${donar}`).json();		

		if (result && Array.isArray(result)) {

			const headerResult = {
				donar: result[0].donar,
				accountingUnitName: result[0].accountingUnitName,
				postcode: result[0].postcode,
				donorStatus: result[0].donorStatus,

				totals: {}
			};

			result.forEach(i => {
				if (headerResult.totals[i.partyName]) {
					headerResult.totals[i.partyName] = headerResult.totals[i.partyName] + i.amount;
				} else {
					headerResult.totals[i.partyName] = i.amount;
				}
			});
			
			setDonarDetails(result);
			setDonarHeader(headerResult);

		}
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

				{page === "parties" && (
					<PartiesPage onQueryPartyDonars={onQueryPartyDonars} onSearchDonarNames={onSearchDonarNames} />
				)}

				{page === "donars" && (
					<DonarsPage partyDonations={partyDonations} onQueryDonar={onQueryDonar} />
				)}
				
				{page === "donarDetails" && (
					<DonarDetailsPage donarDetails={donarDetails} donarHeader={donarHeader} />
				)}

				{globalMessage.type && <Toast message={globalMessage} />}
			</div>
		</main>
	);
};

export default App;
