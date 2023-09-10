import "./styles/about.css";

function About() {
	return (
		<article className='about'>
			<section className='description'>
				<h2>Description:</h2>
				<p>
					MP Analiser is a comprehensive and user-friendly
					application designed to analyze the voting records of
					different members of the UK Parliament...
				</p>
				<p>
					This is a very early prototype which much more to come
				</p>
			</section>

			<section className='features'>
				<h2>Upcoming Features:</h2>
				<p>
					<ul>
						<li>
							Voting Analysis using graph based data
							science algorithms
						</li>
						<li>Search and Filter</li>
						<li>Visual Insights</li>
					</ul>
				</p>
			</section>

			{/* <section className='contact'>
				<h2>Get involved:</h2>
				<p>
					<ul>
						<li>Help with development</li>
						<li>Help with hosting</li>
						<li>Help with storage</li>
						<li>Help with funding</li>
					</ul>
				</p>
			</section> */}

			<section>
				<h1>Ideas for Neo4j Graph Database Queries</h1>
				<ol>
					<li>
						<strong>Community Detection</strong>:
						<p>Use graph algorithms like Louvain or Label Propagation to detect communities or groups of MPs with similar voting patterns or affiliations.</p>
					</li>
					<li>
						<strong>Influential MPs</strong>:
						<p>Identify the most influential MPs in the network by calculating centrality measures such as degree centrality, betweenness centrality, or closeness centrality.</p>
					</li>
					<li>
						<strong>Voting Blocs</strong>:
						<p>Find groups of MPs who consistently vote together and analyze their voting patterns to identify voting blocs within the legislative body.</p>
					</li>
					<li>
						<strong>Predictive Modeling</strong>:
						<p>Build predictive models to forecast how specific MPs may vote on future issues based on their voting history and the voting history of their peers.</p>
					</li>
					<li>
						<strong>Temporal Analysis</strong>:
						<p>Analyze how voting patterns change over time, such as voting trends across different sessions or legislative periods.</p>
					</li>
					<li>
						<strong>Party Affiliation</strong>:
						<p>Explore the relationships between MPs and their respective political parties by analyzing voting behavior within party lines.</p>
					</li>
					<li>
						<strong>Influence Propagation</strong>:
						<p>Study how voting decisions of influential MPs propagate through the network and influence the votes of other MPs.</p>
					</li>
					<li>
						<strong>Identify Swing Voters</strong>:
						<p>Identify MPs who frequently change their voting patterns and may play a crucial role in determining the outcome of votes.</p>
					</li>
					<li>
						<strong>Geospatial Analysis</strong>:
						<p>If you have geographical data for MPs' constituencies, perform geospatial analysis to find patterns related to voting behavior and geographical location.</p>
					</li>
					<li>
						<strong>Network Visualization</strong>:
						<p>Create visualizations of your graph to gain insights into the overall structure of the legislative network and identify clusters of MPs with similar voting behavior.</p>
					</li>
					<li>
						<strong>Keyword Analysis</strong>:
						<p>Analyze the text of bills or issues being voted on to identify keywords or topics that are strongly associated with specific voting patterns.</p>
					</li>
					<li>
						<strong>Cross-Party Alliances</strong>:
						<p>Detect instances where MPs from different parties vote together on specific issues and explore the reasons behind these cross-party alliances.</p>
					</li>
					<li>
						<strong>Sentiment Analysis</strong>:
						<p>Perform sentiment analysis on speeches or statements made by MPs to understand the emotional context surrounding specific votes.</p>
					</li>
					<li>
						<strong>Dynamic Subgraph Analysis</strong>:
						<p>Create dynamic subgraphs based on specific time periods or events to analyze how the network evolves over time.</p>
					</li>
					<li>
						<strong>Link Prediction</strong>:
						<p>Use link prediction algorithms to predict potential voting relationships between MPs who have not yet voted together.</p>
					</li>
				</ol>
			</section>
		</article>
	);
}

export default About;
