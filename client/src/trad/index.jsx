import React from 'react';
import { Card, CardContent, Typography, Grid, Container } from '@mui/material';


const TradeStatisticCard = ({ title, value }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body1">{value}</Typography>
            </CardContent>
        </Card>
    );
};

const TradeStatisticsUI = ({ tradeData }) => {
    const { open, high, low, close, volume } = tradeData;

    return (
        <Grid container spacing={2} mt="2px" mb="2px">
            <Grid item xs={12} sm={6} md={4}>
                <TradeStatisticCard title="Opening Price" value={open} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <TradeStatisticCard title="Closing Price" value={close} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <TradeStatisticCard title="Volume" value={volume} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <TradeStatisticCard title="Highest Price" value={high} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <TradeStatisticCard title="Lowest Price" value={low} />
            </Grid>


        </Grid>
    );
};

export default TradeStatisticsUI