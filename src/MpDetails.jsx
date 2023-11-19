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
	onChangeSummaryDateRange,
	details,
	onQueryMpByName,
	onQueryMp,
	onQueryDivision,
	setGlobalMessage,
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

		const url = `${config.mpsApiUrl}votingSimilarityNeo?limit=${limit}&orderby=${orderby}&name=${details?.value?.nameDisplayAs}&id=${details?.value?.id}&fromDate=${fromDate}&toDate=${toDate}${queryParams}`;

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
				`${config.mpsApiUrl}votingDetailsNeo?id=${details?.value?.id}&type=${type}&fromDate=${fromDate}&toDate=${toDate}$`
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

	const isValidDateAfter2000 = (dateString) => {
		// Parse the input string into a Date object
		const dateObject = new Date(dateString);

		// Check if the parsing was successful and the date is after the year 2000
		return !isNaN(dateObject.getTime()) && dateObject.getFullYear() > 2000;
	}

	const onChangeSummaryDatePicker = (type, value) => {

		//TODO do we need debounce as well as valid date check?

		if (type === "from") {
			setFromDate(value);

			if (isValidDateAfter2000(value)) {
				onChangeSummaryDateRange(details?.value?.id, value, toDate);
			}

		} else {
			setToDate(value);

			if (isValidDateAfter2000(value)) {
				onChangeSummaryDateRange(details?.value?.id, fromDate, value);
			}

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
							<tr>
								<th>Status Description</th>
								<td>
									{
										details.value
											.latestHouseMembership
											?.membershipStatus
											?.statusDescription
									}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="fieldsetsWrapper">

					<fieldset>
						<legend>Filters</legend>

						<div className="filterWrapper" style={{ paddingBottom: 8, display: "flex", flexDirection: "column", gap: 12 }}>
							<div className="datePicker">

								<label style={{ marginRight: 36 }} for="start">Between:</label>
								<input
									type="date"
									id="start"
									min={EARLIEST_FROM_DATE}
									max={new Date().toISOString().substr(0, 10)}
									name="from-date"
									onChange={(e) => onChangeSummaryDatePicker("from", e.target.value)}
									value={fromDate}
								/>

								{/* <label for="start" style={{ marginLeft: 8, marginRight: 8 }}>and:</label> */}
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
								<label for="divisionCategory">Division Type</label>
								<select
									className="select insights__select"
									name="divisionCategory"
									disabled
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

						</div>

					</fieldset>

					<fieldset>
						<legend>Voting analysis</legend>

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

					<div style={{ height: 8 }} />

					<fieldset>
						<legend>Voting details</legend>
						<div className='mpDetails__actions'>

							{votingSummary && (
								<div className='votingSummary'>
									<h4>
										How{" "}
										{
											details.value.nameDisplayAs.split(
												" "
											)[0]
										}{" "}
										voted
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

										<span className='votingSummary__buttons__count'>
											{votingSummary?.total}
										</span>
										<span className='votingSummary__buttons__count'>
											{votingSummary?.votedAye || 0}
										</span>
										<span className='votingSummary__buttons__count'>
											{votingSummary?.votedNo || 0}
										</span>
									</div>
								</div>
							)}
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
