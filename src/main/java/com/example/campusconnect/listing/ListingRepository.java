package com.example.campusconnect.listing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findBySellerId(Long sellerId);

    List<Listing> findByCategory(String category);

    @Query("SELECT l FROM Listing l WHERE " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Listing> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT l FROM Listing l WHERE " +
           "(:keyword IS NULL OR LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:category IS NULL OR l.category = :category)")
    List<Listing> searchWithFilter(@Param("keyword") String keyword, @Param("category") String category);
}
