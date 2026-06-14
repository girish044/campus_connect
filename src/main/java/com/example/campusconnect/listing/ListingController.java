package com.example.campusconnect.listing;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "*")
public class ListingController {

    private final ListingRepository listingRepository;

    public ListingController(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    // GET ALL LISTINGS (with optional search and category filter)
    @GetMapping
    public ResponseEntity<List<Listing>> getAllListings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {

        List<Listing> listings;

        if ((keyword != null && !keyword.trim().isEmpty()) || (category != null && !category.trim().isEmpty())) {
            String kw = (keyword == null || keyword.trim().isEmpty()) ? null : keyword.trim();
            String cat = (category == null || category.trim().isEmpty()) ? null : category.trim();
            listings = listingRepository.searchWithFilter(kw, cat);
        } else {
            listings = listingRepository.findAll();
        }

        return ResponseEntity.ok(listings);
    }

    // GET SINGLE LISTING
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getListing(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        Optional<Listing> opt = listingRepository.findById(id);
        if (opt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Listing not found.");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("success", true);
        response.put("listing", opt.get());
        return ResponseEntity.ok(response);
    }

    // GET LISTINGS BY USER (My Listings)
    @GetMapping("/user/{sellerId}")
    public ResponseEntity<List<Listing>> getMyListings(@PathVariable Long sellerId) {
        return ResponseEntity.ok(listingRepository.findBySellerId(sellerId));
    }

    // CREATE LISTING
    @PostMapping
    public ResponseEntity<Map<String, Object>> createListing(@RequestBody Listing listing) {
        Map<String, Object> response = new HashMap<>();

        if (listing.getTitle() == null || listing.getTitle().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Title is required.");
            return ResponseEntity.badRequest().body(response);
        }

        if (listing.getDescription() == null || listing.getDescription().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Description is required.");
            return ResponseEntity.badRequest().body(response);
        }

        if (listing.getPrice() <= 0) {
            response.put("success", false);
            response.put("message", "Please enter a valid price.");
            return ResponseEntity.badRequest().body(response);
        }

        if (listing.getCategory() == null || listing.getCategory().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Please select a category.");
            return ResponseEntity.badRequest().body(response);
        }

        Listing saved = listingRepository.save(listing);
        response.put("success", true);
        response.put("message", "Listing posted successfully!");
        response.put("listing", saved);
        return ResponseEntity.ok(response);
    }

    // UPDATE LISTING
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateListing(@PathVariable Long id, @RequestBody Listing updated) {
        Map<String, Object> response = new HashMap<>();

        Optional<Listing> opt = listingRepository.findById(id);
        if (opt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Listing not found.");
            return ResponseEntity.badRequest().body(response);
        }

        Listing existing = opt.get();

        // Only allow seller to update their own listing
        if (!existing.getSellerId().equals(updated.getSellerId())) {
            response.put("success", false);
            response.put("message", "You can only edit your own listings.");
            return ResponseEntity.badRequest().body(response);
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());

        listingRepository.save(existing);

        response.put("success", true);
        response.put("message", "Listing updated successfully.");
        return ResponseEntity.ok(response);
    }

    // DELETE LISTING
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteListing(@PathVariable Long id, @RequestParam Long sellerId) {
        Map<String, Object> response = new HashMap<>();

        Optional<Listing> opt = listingRepository.findById(id);
        if (opt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Listing not found.");
            return ResponseEntity.badRequest().body(response);
        }

        Listing listing = opt.get();

        if (!listing.getSellerId().equals(sellerId)) {
            response.put("success", false);
            response.put("message", "You can only delete your own listings.");
            return ResponseEntity.badRequest().body(response);
        }

        listingRepository.deleteById(id);

        response.put("success", true);
        response.put("message", "Listing deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
