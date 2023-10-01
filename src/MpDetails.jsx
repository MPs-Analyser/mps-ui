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

const MpDetails = ({
	votingSummary,
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

	const [progress, setProgress] = useState();

	useEffect(() => {
		setExcludeParties(details?.value?.latestParty?.name);
	}, [details]);

	const onToggleExcludeInclude = () => {
		setIsExcludingParties(!isExcludingParties)
		setIsIncludingParties(!isIncludingParties)
	}

	const Party = {
		CONSERVATIVE: "Conservative",
		LABOUR: "Labour",
		LIBERAL_DEMOCRATS: "Liberal Democrats",
		GREEN: "Green Party",
		SNP: "Scottish National Party",
		PLAID_CYMRU: "Plaid Cymru",
		DUP: "Democratic Unionist Party",
		SINN_FEIN: "Sinn Féin",
		UUP: "Ulster Unionist Party",
		SDLP: "Social Democratic and Labour Party",
		BREXIT_PARTY: "Brexit Party",
		RECLAIM: "The Reclaim Party",
		UNKNOWN: "Unknown",
	};

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

	const onGetVotingSimilarity = async () => {
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

		const url = `${config.mpsApiUrl}votingSimilarityNeo?name=${details?.value?.nameDisplayAs}${queryParams}`;
		
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
					borderColor: "rgba(0,0,0,1)",
					borderWidth: 2,
					indexAxis: "y",
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
				`${config.mpsApiUrl}votingDetailsNeo?id=${details?.value?.id}&type=${type}`
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

				<div className='mpDetails__actions'>
					<button
						className='button'
						onClick={onGetVotingSimilarity}
					>
						Most Similar Voting Mps
					</button>

					<div className="mpDetails__toggle-wrapper">
						<div>
							<Switch onToggle={onToggleExcludeInclude} isChecked={isExcludingParties} />
							<label>Exclude</label>
						</div>
						<input className="mpDetails__input" value={excludeParties} disabled={!isExcludingParties} onChange={(e) => setExcludeParties(e.target.value) }></input>
					</div>

					<div className="mpDetails__toggle-wrapper">
						<div>
							<Switch onToggle={onToggleExcludeInclude} isChecked={isIncludingParties} />
							<label>Include</label>
						</div>
						<input className="mpDetails__input" value={includeParties} disabled={!isIncludingParties} onChange={(e) => setIncludeParties(e.target.value) } ></input>
					</div>


					{/* <button className="button">Least Similar Voting Mps</button> */}
					<button
						className='button'
						onClick={() => onGetVotingHistory("all")}
					>
						Voting History
					</button>

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
			</section>

			{votingSimilarity && (
				<BarChart
					barChartData={barChartData}
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
