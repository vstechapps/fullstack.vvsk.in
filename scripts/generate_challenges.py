import json
import re
from pathlib import Path

problems = [
    ("Two Sum", "Arrays", "Easy", "Find two numbers in a list that add up to a target value and return their indices.", 60, 6),
    ("Best Time to Buy and Sell Stock", "Arrays", "Easy", "Choose a single buy and sell day to maximize profit with one transaction.", 70, 7),
    ("Contains Duplicate", "Arrays", "Easy", "Determine whether any value appears at least twice in the array.", 60, 6),
    ("Product of Array Except Self", "Arrays", "Medium", "Return a new array where each element is the product of all other elements.", 110, 10),
    ("Valid Sudoku", "Matrix", "Medium", "Validate whether a 9x9 grid follows Sudoku rules.", 120, 12),
    ("Meeting Rooms", "Intervals", "Easy", "Check whether a set of meetings can all be scheduled without overlap.", 80, 8),
    ("Merge Intervals", "Intervals", "Medium", "Merge overlapping intervals into a minimal non-overlapping set.", 120, 12),
    ("Group Anagrams", "Strings", "Medium", "Group words that contain the same letters under different orders.", 120, 12),
    ("Top K Frequent Elements", "Hashing", "Medium", "Return the k most frequent elements from an array.", 130, 13),
    ("Longest Consecutive Sequence", "Hashing", "Medium", "Find the length of the longest consecutive run in an unsorted array.", 140, 14),
    ("Valid Palindrome", "Strings", "Easy", "Check whether a string is a palindrome ignoring non-alphanumeric characters.", 90, 9),
    ("Two Sum II - Input Array Is Sorted", "Arrays", "Medium", "Find indices of two numbers in a sorted array that sum to a target.", 110, 10),
    ("3Sum", "Arrays", "Medium", "Find all unique triplets whose sum is zero.", 140, 14),
    ("Container With Most Water", "Greedy", "Medium", "Find the maximum area formed by two lines and the x-axis.", 120, 12),
    ("Trapping Rain Water", "Greedy", "Hard", "Compute how much water can be trapped between vertical bars.", 170, 17),
    ("Best Time to Buy and Sell Stock II", "Greedy", "Medium", "Maximize profit by buying and selling multiple times.", 120, 12),
    ("Maximum Subarray", "Dynamic Programming", "Medium", "Find the contiguous subarray with the largest sum.", 150, 15),
    ("Climbing Stairs", "Dynamic Programming", "Easy", "Count the number of distinct ways to reach the top of a staircase.", 90, 9),
    ("House Robber", "Dynamic Programming", "Medium", "Maximize the stolen amount without robbing adjacent houses.", 130, 13),
    ("Longest Palindromic Substring", "Strings", "Medium", "Return the longest palindromic substring in a string.", 140, 14),
    ("Palindrome Partitioning", "Backtracking", "Medium", "Partition a string into palindromic substrings.", 150, 15),
    ("Word Break", "Dynamic Programming", "Medium", "Determine whether a string can be segmented into dictionary words.", 150, 15),
    ("Coin Change", "Dynamic Programming", "Medium", "Return the minimum number of coins needed to make a target amount.", 150, 15),
    ("Counting Bits", "Dynamic Programming", "Easy", "Count the number of set bits for every value from 0 to n.", 110, 11),
    ("Number of Islands", "Graphs", "Medium", "Count connected groups of land cells in a grid.", 150, 15),
    ("Binary Tree Level Order Traversal", "Trees", "Medium", "Traverse a binary tree level by level and return each level as a list.", 130, 13),
    ("Valid Binary Search Tree", "Trees", "Medium", "Ensure a binary tree satisfies BST ordering rules.", 130, 13),
    ("Symmetric Tree", "Trees", "Easy", "Check whether a binary tree is mirror-symmetric.", 90, 9),
    ("Maximum Depth of Binary Tree", "Trees", "Easy", "Compute the maximum depth of a binary tree.", 80, 8),
    ("Construct Binary Tree from Preorder and Inorder Traversal", "Trees", "Medium", "Rebuild a binary tree from traversal arrays.", 160, 16),
    ("Binary Tree Maximum Path Sum", "Trees", "Hard", "Find the maximum path sum anywhere in a tree.", 180, 18),
    ("Serialize and Deserialize Binary Tree", "Trees", "Hard", "Convert a tree to a string and reconstruct it.", 180, 18),
    ("Subtree of Another Tree", "Trees", "Easy", "Check whether one tree is a subtree of another.", 100, 10),
    ("Lowest Common Ancestor of a Binary Search Tree", "Trees", "Medium", "Find the lowest common ancestor in a BST.", 130, 13),
    ("Implement Trie (Prefix Tree)", "Trees", "Medium", "Build a trie that supports insert, search, and prefix operations.", 150, 15),
    ("Word Search", "Backtracking", "Medium", "Search for a word in a character board using adjacency.", 150, 15),
    ("Combination Sum", "Backtracking", "Medium", "Find all unique combinations summing to a target.", 160, 16),
    ("Permutations", "Backtracking", "Medium", "Generate all possible permutations of a list of numbers.", 150, 15),
    ("N-Queens", "Backtracking", "Hard", "Place N queens on an N x N board without attacking each other.", 180, 18),
    ("Majority Element", "Arrays", "Easy", "Find the element that appears more than half the time.", 90, 9),
    ("Missing Number", "Arrays", "Easy", "Find the missing integer in a range from 0 to n.", 100, 10),
    ("Convert Sorted Array to Binary Search Tree", "Trees", "Easy", "Build a height-balanced BST from a sorted array.", 110, 11),
    ("Merge Two Sorted Lists", "Linked Lists", "Easy", "Merge two sorted linked lists into one sorted list.", 90, 9),
    ("Linked List Cycle", "Linked Lists", "Easy", "Detect whether a linked list contains a cycle.", 100, 10),
    ("Reverse Linked List", "Linked Lists", "Easy", "Reverse the nodes of a linked list in place.", 90, 9),
    ("Best Time to Buy and Sell Stock III", "Dynamic Programming", "Medium", "Maximize profit with at most two transactions.", 170, 17),
    ("Longest Increasing Subsequence", "Dynamic Programming", "Medium", "Find the length of the longest strictly increasing subsequence.", 160, 16),
    ("Unique Paths", "Dynamic Programming", "Medium", "Count the number of ways to reach the bottom-right corner.", 150, 15),
    ("Unique Paths II", "Dynamic Programming", "Medium", "Count valid paths in a grid with obstacles.", 160, 16),
    ("Minimum Path Sum", "Dynamic Programming", "Medium", "Find the smallest cost path from start to finish.", 160, 16),
    ("Decode Ways", "Dynamic Programming", "Medium", "Count the number of decode interpretations of a message.", 170, 17),
    ("Word Ladder", "Graphs", "Hard", "Find the shortest transformation sequence from one word to another.", 220, 22),
    ("Course Schedule", "Graphs", "Medium", "Determine whether it is possible to finish all courses given prerequisites.", 170, 17),
    ("Graph Valid Tree", "Graphs", "Medium", "Check if a graph is a valid tree structure.", 180, 18),
    ("Topological Sort", "Graphs", "Medium", "Return a valid ordering of nodes in a directed acyclic graph.", 180, 18),
    ("Kth Largest Element in an Array", "Sorting", "Medium", "Find the k-th largest element in an unsorted array.", 150, 15),
]

root = Path(__file__).resolve().parents[1] / "data" / "challenges"
root.mkdir(parents=True, exist_ok=True)

for index, (title, category, difficulty, description, xp, gems) in enumerate(problems, start=1):
    safe = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    filename = f"{index:02d}-{safe}.json"
    payload = {
        "category": category,
        "difficulty": difficulty,
        "icon": "",
        "locked": False,
        "description": description,
        "requirements": [
            f"Implement a correct solution for {title} using a clear algorithmic approach.",
            "Write clean logic that handles edge cases and invalid inputs gracefully.",
            "Validate the solution with sample inputs and explain the time and space complexity."
        ],
        "xp": xp,
        "title": title,
        "gems": gems,
    }
    with (root / filename).open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")

print(f"Created {len(problems)} challenge files in {root}")
print(sorted(p.name for p in root.glob("*.json"))[:5])
