import axios from 'axios';

const API_URL = '/api/poll';


export const createPoll = async (pollData) => {
    try {
        const response = await axios.post(`${API_URL}`, pollData);
        return response.data; // This should return the generated poll link and poll ID
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const getPoll = async (pollId) => {
    try {
        const response = await axios.get(`${API_URL}/${pollId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const submitRankings = async (pollId, rankings) => {
    try {
        const response = await axios.post(`${API_URL}/${pollId}/submit-rankings`, rankings);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const endPoll = async (pollId) => {
    try {
        const response = await axios.post(`${API_URL}/${pollId}/end`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const getPollResults = async (pollId) => {
    try {
        const response = await axios.get(`${API_URL}/${pollId}/results`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
