package com.example.demo.Service;

import com.example.demo.Model.SearchHistory;
import com.example.demo.Repository.SearchHistoryRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SearchHistoryService {
    private  final SearchHistoryRepo searchHistoryRepo;

    public SearchHistoryService(SearchHistoryRepo searchHistoryRepo) {
        this.searchHistoryRepo = searchHistoryRepo;
    }
 //Adding the Searched City //
    public void saveSearch(String city){
        searchHistoryRepo.save(new SearchHistory(city));
 }
 //fetching All Searched City //
    public List<SearchHistory> getHistory(){
        return searchHistoryRepo.findAll();

    }
    //Deleting City  //
    public void deleteHistory(String city){
        List<SearchHistory> history = searchHistoryRepo.findByCityIgnoreCase(city);

        if(history.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"SearchHistory not found");
        }
        searchHistoryRepo.deleteAll(history);
    }





}
