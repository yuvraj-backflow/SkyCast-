package com.example.demo.Repository;

import com.example.demo.Model.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
// It stores data in the Search History Table //
public interface SearchHistoryRepo extends JpaRepository<SearchHistory,Long> {

    List<SearchHistory> findByCityIgnoreCase(String city);

}
