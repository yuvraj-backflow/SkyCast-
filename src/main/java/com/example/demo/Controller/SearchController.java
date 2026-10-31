package com.example.demo.Controller;

import com.example.demo.Model.SearchHistory;
import com.example.demo.Service.SearchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Search")
public class SearchController {
    @Autowired
    private  SearchHistoryService searchHistoryService ;
  // Search History //
@GetMapping
    public List<SearchHistory> getSearchHistory(){
        return searchHistoryService.getHistory();
}
  // Search History Delete //
@DeleteMapping("/{city}")
    public void delete(@PathVariable  String city){
        searchHistoryService.deleteHistory(city);
}
}
