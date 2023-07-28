import TradeStatisticsUI from './trad';
import { Formik } from 'formik'
import { useState, useEffect, useRef } from 'react'
import { Spinner } from 'react-bootstrap';
import * as yup from 'yup'
import axios from "axios";
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box, Button, TextField } from '@mui/material'
import './index.css';

let initialValue = {
	tickerName: '',
	date: '',
}

let validationSchemes = yup.object().shape({

	tickerName: yup.string().required("required"),
	date: yup.string().required("required"),
})

function App() {
	const [resTicker, setResTicker] = useState(null)
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	let isNonMobile = useMediaQuery("(min-width:600px)");

	const errorComponent = error ? <div className="error">
		<i class="material-icons error-icon"></i>
		{error}
	</div>
		: '';


	const handleFormSubmit = (value) => {
		let uppderCaseSymbole = value.tickerName

		setIsLoading(true)
		fetchTickerData({ stocksTicker: uppderCaseSymbole.toUpperCase(), Date: value.date })
	}

	const fetchTickerData = (ticker) => {
		setError(null);
		setResTicker(null)
		axios.post(`http://localhost:5000/api/fetchStockData`, ticker).then((response) => {
			if (response.status === 200) {
				setIsLoading(false)
				setResTicker(response.data)
			}
		}).catch((error) => {
			console.log("error-----------", error.message, error)
			setIsLoading(false)
			if (error.message === 'Network Error') {
				setError('Network Error: Unable to connect to the server');
			} else if (error.message === 'Request failed with status code 404') {
				setError('Data Not Found: Please Enter Valid Stock Symbol')
			} else {
				setError('Server issue try again Some Time')
			}
		})

	}


	return (
		<div className="max-w-[1240px] shadow-xl min-h-[400px] mx-auto mt-20 p-3">
			<Box m="20px">
				<Formik
					onSubmit={handleFormSubmit}
					initialValues={initialValue}
					validationSchema={validationSchemes}
				>
					{({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
						<form onSubmit={handleSubmit} >
							<Box display="grid" gap="30px" gridTemplateColumns="repeat(4,minmax(0,1fr))" sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }, }}

							>
								<TextField
									fullWidth
									variant='filled'
									id='tickerName'
									type='text'
									label='Stock Symbol'
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.tickerName}
									name='tickerName'
									error={!!touched.tickerName && !!errors.tickerName}
									helperText={touched.tickerName && errors.tickerName}
									sx={{ gridColumn: "span 2" }}


								/>
								<TextField
									fullWidth
									variant='filled'
									id='date'
									type='date'
									label=''
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.date}
									name='date'
									error={!!touched.date && !!errors.date}
									helperText={touched.date && errors.date}
									sx={{ gridColumn: "span 2" }}

								/>
							</Box>
							{errorComponent}
							<Box display="flex" justifyContent="end" mt="20px">
								<Button type='submit' color="secondary" variant='contained'>
									Submit
								</Button>
							</Box>
						</form>
					)}
				</Formik>
				{isLoading && (
					<Box display="flex" justifyContent="center">
						<Spinner animation="border" role="status">
							<span className="visually-hidden"></span>
						</Spinner>
					</Box>
				)}
				{resTicker && (
					<React.Fragment>
						<TradeStatisticsUI tradeData={resTicker} />
						{/* <StockChart data={resTicker} /> */}
					</React.Fragment>
				)}
			</Box>

		</div>
	);
}

export default App;