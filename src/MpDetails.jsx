import { useState, useEffect } from "react";

import VotingHistory from "./VotingHistory";

import PartyLogo from "./PartyLogo";

import "./styles/mpDetails.css";

import ky from "ky-universal";
import BarChart from "./BarChart";

import commonsImage from "./assets/commons.png";
import lordsImage from "./assets/lords.png";

import Switch from "./shared/Switch";

import { config } from "./app.config";

import {
	Party,
	EARLIEST_FROM_DATE,
	VOTING_CATEGORIES
} from "./config/constants";

const MpDetails = ({
	votingSummary,
	details,
	onQueryMpByName,
	onQueryMp,
	onQueryDivision,
	setGlobalMessage,
	onApplyGlobalFilter,
	filterInProgress,
	setFilterInProgress
}) => {
	const [votingSimilarity, setVotingSimilarity] = useState();
	const [votingHistory, setVotingHistory] = useState();
	const [barChartData, setBarChartData] = useState();

	//similarity params
	const [isExcludingParties, setIsExcludingParties] = useState(true);
	const [isIncludingParties, setIsIncludingParties] = useState(false);
	const [excludeParties, setExcludeParties] = useState("");
	const [includeParties, setIncludeParties] = useState("");
	const [limit, setLimit] = useState(10);

	const [fromDate, setFromDate] = useState(new Date(new Date(EARLIEST_FROM_DATE)).toISOString().substr(0, 10));
	const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));
	const [divisionCategory, setDivisionCategory] = useState("Any");

	const [progress, setProgress] = useState();

	useEffect(() => {
		setExcludeParties(details?.value?.latestParty?.name);
	}, [details]);

	const onToggleExcludeInclude = (type) => {
		console.log(type);
		if (type === "include") {
			setIsIncludingParties(!isIncludingParties);
			if (isExcludingParties) {
				setIsExcludingParties(false);
			}
		} else {
			setIsExcludingParties(!isExcludingParties);
			if (isIncludingParties) {
				setIsIncludingParties(false);
			}
		}
	}

	const getColour = (partyName) => {

		if (!Object.values(Party).includes(partyName)) {
			partyName = Party.UNKNOWN;
		}

		switch (partyName) {
			case Party.CONSERVATIVE:
				return "#0a3b7c";
			case Party.LABOUR:
				return "#e4003b";
			case Party.LIBERAL_DEMOCRATS:
				return "#fabb00";
			case Party.GREEN:
				return "#6ab023";
			case Party.SNP:
				return "#ffdf00";
			case Party.PLAID_CYMRU:
				return "#008142";
			case Party.DUP:
				return "#d46a4c";
			case Party.SINN_FEIN:
				return "#326760";
			case Party.UUP:
				return "#48a5ee";
			case Party.SDLP:
				return "#2aa82c";
			case Party.BREXIT_PARTY:
				return "#5b7eb5";
			case Party.RECLAIM:
				return "#14172d";
			case Party.UNKNOWN:
				return "black"
			default:
				throw new Error("Unknown party");
		}
	};

	const partyColor = getColour(details.value.latestParty.name);

	const onGetVotingSimilarity = async (orderby) => {
		setProgress("Getting voting similarity...");
		//clear voting history to make space for similarity
		setVotingHistory(undefined);

		setTimeout(
			() =>
				document
					.getElementsByClassName("container")[0]
					.scrollTo(0, document.body.scrollHeight),
			100
		);

		let queryParams = '';

		if (isExcludingParties && excludeParties) {
			queryParams = `&partyExcludes=${excludeParties}`;
		} else if (isIncludingParties && includeParties) {
			queryParams = `&partyIncludes=${includeParties}`;
		}

		const url = `${config.mpsApiUrl}votingSimilarityNeo?limit=${limit}&orderby=${orderby}&name=${details?.value?.nameDisplayAs}&id=${details?.value?.id}&fromDate=${fromDate}&toDate=${toDate}&category=${divisionCategory}${queryParams}`;

		const result = await ky(url).json();

		setVotingSimilarity(result);

		//TODO something not working getting the css variable for bar colour so using localstorage direct. fix this
		const chartData = {
			labels: [],
			datasets: [
				{
					label: "Voting Similarity",
					backgroundColor:
						window.localStorage.getItem("theme") ===
							"light-mode"
							? "#a972cb"
							: "#980c4c",
					borderColor: "#262a32",
					borderWidth: 2,
					// barThickness: 5,
					indexAxis: "y",
					width: "40px",
					data: [],
				},
			],
		};

		result.forEach((element) => {
			chartData.labels.push(element.name);
			chartData.datasets[0].data.push(element.score);
		});

		setBarChartData(chartData);
		setProgress(undefined);
	};

	const onGetVotingHistory = async (type) => {
		setProgress("Analysing voting history...");

		//clear similarity to make space for voting history
		setVotingSimilarity(undefined);
		setBarChartData(undefined);
		setVotingHistory(undefined);

		//TODO scroll to bottom probably should be for mobile only
		setTimeout(
			() =>
				document
					.getElementsByClassName("container")[0]
					.scrollTo(0, document.body.scrollHeight),
			1
		);

		try {

			const response = await ky(
				`${config.mpsApiUrl}votingDetailsNeo?id=${details?.value?.id}&type=${type}&fromDate=${fromDate}&toDate=${toDate}&category=${divisionCategory}`
			).json();

			const formattedResults = [];
			response.records.forEach(i => {
				const memberVotedAye = type === "votedAye" ? true : type === "votedNo" ? false : i._fields[3];
				formattedResults.push({
					divisionId: i._fields[0].low,
					title: i._fields[1],
					date: i._fields[2],
					memberVotedAye
				})
			});

			setVotingHistory(formattedResults);
			setProgress(undefined);
		} catch (error) {
			setProgress(undefined);
			console.error(error);
			setVotingHistory(undefined);
			setGlobalMessage({ type: "error", text: error.message });
		}
	};

	const onChangeSummaryDatePicker = (type, value) => {
		if (type === "from") {
			setFromDate(value);
		} else {
			setToDate(value);
		}
	}

	const onApplyFilter = async () => {
		setFilterInProgress(true);
		// onChangeSummaryDateRange(details?.value?.id, fromDate, toDate);
		await onApplyGlobalFilter(details?.value?.id, fromDate, toDate, divisionCategory);
		// setFilterInProgress(false);
	}

	const displayNameString = (name) => `How ${name} voted`

	const displayName = (value = "") => {
		let nameArray = value.split(" ");
		if (nameArray.length === 3) {
			return displayNameString(nameArray[1]);
		} else {
			return displayNameString(nameArray[0]);
		}
	}

	return (
		<>
			<section className='mpDetails'>
				<div className='mpDetails_image_title'>
					<img
						className='mpDetails__image'
						src={`${details.value?.thumbnailUrl}`}
					/>

					<div className='mpDetails__titleWrapper'>
						<div className='mpDetails_logo_title'>
							<PartyLogo
								backgroundColour={`${partyColor}`}
								foregroundColour={`#${details?.value?.latestParty?.foregroundColour}`}
								partyName={
									details?.value?.latestParty?.name
								}
							/>
							<span>
								<h4>{details.value.nameDisplayAs}</h4>
							</span>
						</div>

						<div className='house__tooltop'>
							{details.value.latestHouseMembership
								?.house === 1
								? "House of Commons"
								: "House of Lords"}
						</div>
						<div className='house__wrapper'>
							<img
								className='mpDetails__house'
								src={
									details.value.latestHouseMembership
										?.house === 1
										? `${commonsImage}`
										: `${lordsImage}`
								}
							/>
						</div>
					</div>
				</div>

				<div className='mpDetails__overview'>
					<table>
						<tbody>
							<tr>
								<th>Constituency</th>
								<td>
									{
										details.value
											.latestHouseMembership
											?.membershipFrom
									}
								</td>
							</tr>
							<tr>
								<th>House</th>
								<td>
									{details.value
										.latestHouseMembership
										?.house === 1
										? "Commons"
										: "Lords"}
								</td>
							</tr>
							<tr>
								<th>Member Since</th>
								<td>
									{details.value
										.latestHouseMembership &&
										details.value.latestHouseMembership?.membershipStartDate.substring(
											0,
											10
										)}
								</td>
							</tr>
							<tr>
								<th>Status</th>
								<td>
									{details.value
										.latestHouseMembership
										?.membershipStatus
										? `Active`
										: `Inactive`}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="fieldsetsWrapper">

					<fieldset style={{ marginTop: -4 }}>

						<legend>

							<svg
								style={{ position: "relative", top: 0, marginRight: 4 }}
								className="standalone-svg"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24">
								<path d="M19 2c1.654 0 3 1.346 3 3v14c0 1.654-1.346 3-3 3h-14c-1.654 0-3-1.346-3-3v-14c0-1.654 1.346-3 3-3h14zm5 3c0-2.761-2.238-5-5-5h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14zm-13 12h-2v3h-2v-3h-2v-3h6v3zm-2-13h-2v8h2v-8zm10 5h-6v3h2v8h2v-8h2v-3zm-2-5h-2v3h2v-3z" />
							</svg>
							<span style={{ position: "relative", top: -6 }}>
								Filters
							</span>

						</legend>


						<div className="filterWrapper" style={{ paddingBottom: 8, display: "flex", flexDirection: "column", gap: 12 }}>
							<div className="datePicker">

								<label style={{ marginRight: 36 }} htmlFor="start">Between:</label>
								<input
									type="date"
									id="start"
									min={EARLIEST_FROM_DATE}
									max={new Date().toISOString().substr(0, 10)}
									name="from-date"
									onChange={(e) => onChangeSummaryDatePicker("from", e.target.value)}
									value={fromDate}
								/>

								<input
									style={{ marginLeft: 8 }}
									type="date"
									min={EARLIEST_FROM_DATE}
									max={new Date().toISOString().substr(0, 10)}
									id="toDate"
									name="to-date"
									onChange={(e) => onChangeSummaryDatePicker("to", e.target.value)}
									value={toDate}
								/>
							</div>

							<div className="filterCategory__wrapper">
								<label htmlFor="divisionCategory">Division Type</label>
								<select
									value={divisionCategory}
									onChange={(e) => setDivisionCategory(e.target.value)}
									className="select insights__select"
									name="divisionCategory"
								>
									{VOTING_CATEGORIES.map(i => (
										<option
											value={i}
											key={i}
										>
											{i}
										</option>
									))}
								</select>
							</div>

							<button
								className='button'
								onClick={onApplyFilter}
							>
								Apply
							</button>


						</div>

					</fieldset>

					<fieldset style={{ marginTop: 8 }}>
						<legend>
							<svg
								style={{ position: "relative", top: 0, marginRight: 4 }}
								className="standalone-svg"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24">
								<path d="M2 0v24h20v-24h-20zm18 22h-16v-15h16v15zm-3-4h-10v-1h10v1zm0-3h-10v-1h10v1zm0-3h-10v-1h10v1z" />
							</svg>
							<span style={{ position: "relative", top: -6 }}>
								Voting details
							</span>
						</legend>
						<div className='mpDetails__actions'>

							{votingSummary && (
								<div className='votingSummary'>
									<h4>
										{displayName(details.value.nameDisplayAs)}
									</h4>

									<div className='votingSummary__buttons'>
										<button
											className='button votingButton'
											onClick={() =>
												onGetVotingHistory("all")
											}
										>
											Total
										</button>
										<button
											className='button'
											onClick={() =>
												onGetVotingHistory("votedAye")
											}
										>
											Aye
										</button>
										<button
											className='button'
											onClick={() =>
												onGetVotingHistory("votedNo")
											}
										>
											No
										</button>


										{!filterInProgress && (
											<>
												<span className='votingSummary__buttons__count'>
													{filterInProgress ? 'a' : votingSummary?.total}
												</span>
												<span className='votingSummary__buttons__count'>
													{votingSummary?.votedAye || 0}
												</span>
												<span className='votingSummary__buttons__count'>
													{votingSummary?.votedNo || 0}
												</span>
											</>
										)}

									</div>

									{filterInProgress && (
										<div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 8 }}>
											<progress value={null} />
										</div>
									)}
								</div>
							)}
						</div>
					</fieldset>

					<div style={{ height: 8 }} />

					<fieldset>
						<legend>

							<svg
								style={{ position: "relative", top: 0, marginRight: 4 }}
								className="standalone-svg"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24">
								<path d="M8 1c0-.552.448-1 1-1h6c.552 0 1 .448 1 1s-.448 1-1 1h-6c-.552 0-1-.448-1-1zm12.759 19.498l-3.743-7.856c-1.041-2.186-2.016-4.581-2.016-7.007v-1.635h-2v2c.09 2.711 1.164 5.305 2.21 7.502l3.743 7.854c.143.302-.068.644-.376.644h-1.497l-4.377-9h-3.682c.882-1.908 1.886-4.377 1.973-7l.006-2h-2v1.635c0 2.426-.975 4.82-2.016 7.006l-3.743 7.856c-.165.348-.241.708-.241 1.058 0 1.283 1.023 2.445 2.423 2.445h13.154c1.4 0 2.423-1.162 2.423-2.446 0-.35-.076-.709-.241-1.056z" />
							</svg>
							<span style={{ position: "relative", top: -6 }}>
								Voting analysis
							</span>

						</legend>

						<div className='mpDetails__actions'>

							<div className="mpDetails__toggle-wrapper">

								<div className="mpDetails__label">
									<Switch onToggle={() => onToggleExcludeInclude("exclude")} isChecked={isExcludingParties} />
									<label>Exclude</label>
								</div>


								<select
									className="mpDetails__select select"
									name="partiesToExclude"
									onChange={(e) => setExcludeParties(e.target.value)}
									value={excludeParties}
									disabled={!isExcludingParties}
								>
									{Object.keys(Party).map(i => (
										<option
											value={Party[i]}
											key={Party[i]}
										>
											{Party[i]}
										</option>
									))}
								</select>
							</div>

							<div className="mpDetails__toggle-wrapper">
								<div className="mpDetails__label">
									<Switch onToggle={() => onToggleExcludeInclude("include")} isChecked={isIncludingParties} />
									<label>Include</label>
								</div>

								<select
									className="mpDetails__select select"
									name="partiesToExclude"
									onChange={(e) => setIncludeParties(e.target.value)}
									value={includeParties}
									disabled={!isIncludingParties}
								>
									{Object.keys(Party).map(i => (
										<option
											value={Party[i]}
											key={Party[i]}
										>
											{Party[i]}
										</option>
									))}
								</select>

							</div>

							<div className="mpDetails__toggle-wrapper">

								<label className="mpDetails__label">Limit</label>

								<input
									className="mpDetails__select input"
									value={limit}
									onChange={(e) => setLimit(e.target.value)}
									type="number">
								</input>

							</div>

							<button
								className='button'
								onClick={() => onGetVotingSimilarity('DESCENDING')}
							>
								Most Similar Voting Mps
							</button>

							<button
								className='button'
								onClick={() => onGetVotingSimilarity('ASCENDING')}
							>
								Least Similar Voting Mps
							</button>
						</div>

					</fieldset>

				</div>

			</section>

			{votingSimilarity && (
				<BarChart
					barChartData={barChartData}
					limit={limit}
					onQueryMpByName={onQueryMpByName}
				/>
			)}

			{progress && (
				<>
					<div className='votingHistoryProgress'>
						<progress value={null} />
						<p>{progress}</p>
					</div>
				</>
			)}

			{votingHistory && (
				<VotingHistory
					votingHistory={votingHistory}
					onQueryMp={onQueryMp}
					onQueryDivision={onQueryDivision}
				/>
			)}
		</>
	);
};

export default MpDetails;
