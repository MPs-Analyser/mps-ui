// import { useState, useEffect, useRef } from "react";

// import ky from 'ky-universal';
// import { config } from './app.config';


const DonarDetailsPage = ({ donarDetails = [] }) => {

	return (
		<div className="donarDetailsPage" style={{ marginTop: 60 }}>

			{donarDetails[0] && (
				<ul>
					<li>{donarDetails[0].donar}</li>
					<li>{donarDetails[0].accountingUnitName}</li>
					<li>{donarDetails[0].postcode}</li>
					<li>{donarDetails[0].donorStatus}</li>
				</ul>
			)}

			<table>
				<thead>
					<tr>
						<th>donationType</th>
						<th>amount</th>
						<th>date</th>
					</tr>
				</thead>
				<tbody>
					{/* {JSON.stringify(donarDetails)} */}
					
					{donarDetails && donarDetails.map(donation => (
						<tr>
							<td>{donation.donationType}</td>
							<td>{donation.amount}</td>
							<td>{donation.receivedDate.year.low}</td>							
						</tr>
					))}
				</tbody>
			</table>
		</div>

	);
};

export default DonarDetailsPage;
