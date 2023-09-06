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

			<section className='contact'>
				<h2>Get involved:</h2>
				<p>
					<ul>
						<li>Help with development</li>
						<li>Help with hosting</li>
						<li>Help with storage</li>
						<li>Help with funding</li>
					</ul>
				</p>
			</section>
		</article>
	);
}

export default About;
