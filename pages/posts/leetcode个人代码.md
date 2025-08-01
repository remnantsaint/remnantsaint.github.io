---
layout: post
title: leetcode个人代码
date: 2025-08-01 12:39:39
cover: 
top: 
tags: 
 - leetcode
categories: 
 - 刷题计划
# author: @Remsait
---
> 记录所有做过的leetcode题
> 

### 1. 两数之和 
思路：用哈希表记录已遍历过的数字和下标，遍历到当前数字时，判断 `target - 当前数字` 是否在哈希表中，若在，则返回两个下标。  
时间复杂度： O(n)  
```c++
class Solution {
   public:
    vector<int> twoSum(vector<int>& nums, int target) {
        map<int, int> s;
        for (int i = 0; i < nums.size(); i++) {
            if (s.count(target - nums[i])!=0) {
                return {i, s[target - nums[i]]};
            }
            s[nums[i]] = i;
        }
        return {};
    }
};
```

### 19. 删除链表的倒数第 N 个结点
思路：使用双指针，先让第一个指针先走 n 步，然后两个指针一起走，当第一个指针到达末尾时，第二个指针正好在倒数第 n 个节点的前一个位置，删除即可。  
时间复杂度：O(n)
```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 * };
 */
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {

    ListNode *dummyhead=new ListNode();//设置虚拟头节点
    dummyhead->next=head;

    ListNode *first,*second;
    first=second=dummyhead;
    while(n--){
        first=first->next;//双指针相差n个，
    }
    //此时first与second相差n个，但是当first到结尾时second->next才是要删除的
    while(first->next!=NULL){//遍历到结尾
        first=first->next;
        second=second->next;
    }
    second->next=second->next->next;//删除second->next
    return dummyhead->next;//返回dummyhead->next，因为有可能首元结点被删去，需要用虚拟头结点
    }
};
```

### 26. 删除有序数组中的重复项
思路：双指针法，快指针遍历数组，慢指针指向去重后最后一个元素的下标，遇到新值时就更新慢指针。  
时间复杂度：O(n)
```c++
class Solution {
   public:
    int removeDuplicates(vector<int>& nums) {
        int slow = 0;
        for (int fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }
        return slow + 1;
    }
};
```

### 27. 移除元素
思路：双指针法，快指针遍历数组，遇到不是目标值的元素就覆盖到慢指针的位置。  
时间复杂度：O(n)
```c++
class Solution {
   public:
    int removeElement(vector<int>& nums, int val) {
        int slow = 0;
        for (int fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != val) {
                nums[slow] = nums[fast];
                slow++;
            }
        }
        return slow;
    }
};
```

### 34. 在排序数组中查找元素的第一个和最后一个位置
思路：二分查找找任意一个匹配位置，然后向左、向右分别继续二分找到第一个和最后一个位置。  
时间复杂度：O(log n)
```c++
class Solution {
   public:
    vector<int> searchRange(vector<int> &nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > target) {
                right = mid - 1;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                int l = checkleft(nums, target, mid);
                int r = checkright(nums, target, mid);
                return {l, r};
                ;
            }
        }
        return {-1, -1};
    }

   private:
    int checkleft(vector<int> &nums, int target, int q) {
        int left = 0, right = q - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return left;  // 和35.搜索插入位置同理，找到第一个大于等于mid的值（因为不可能大于，所以直接是等于）
    }

   private:
    int checkright(vector<int> &nums, int target, int q) {
        int left = q + 1, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > target) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return right;
    }
};
```

### 69. x 的平方根 
思路：用二分查找从 1 ~ x 找到平方小于等于 x 的最大整数。  
时间复杂度：O(log n)
```c++
class Solution {
   public:
    int mySqrt(int x) {
        if (x == 0) return 0;
        int l = 1, r = x;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (mid < x / mid) {
                l = mid + 1;
            } else if (mid > x / mid) {
                r = mid - 1;
            } else
                return mid;
        }
        return l - 1;
    }
};
```

### 283. 移动零
思路：双指针，快指针找非零元素，与慢指针交换。  
时间复杂度：O(n)
```c++
class Solution {
   public:
    void moveZeroes(vector<int>& nums) {
        int slow = 0;
        for (int fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != 0) {
                swap(nums[slow], nums[fast]);
                slow++;
            }
        }
    }
};
```

### 367. 有效的完全平方数
思路： 用二分查找判断某个数是否存在平方等于给定数。  
时间复杂度： O(log n)  
```c++
class Solution {
   public:
    bool isPerfectSquare(int num) {
        if (num == 0) return 0;
        int l = 1, r = num;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (mid > num / mid) {
                r = mid - 1;
            } else if (mid < num / mid) {
                l = mid + 1;
            } else
                return mid * mid == num;
        }
        return 0;
    }
};
```

### 704. 二分查找
思路： 在有序数组中用标准二分查找找到目标值。  
时间复杂度： O(log n)
```c++
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1; // 定义target在左闭右闭的区间里，[left, right]
        while (left <= right) { // 当left==right，区间[left, right]依然有效，所以用 <=
            int middle = left + ((right - left) / 2);// 防止溢出 等同于(left + right)/2
            if (nums[middle] > target) {
                right = middle - 1; // target 在左区间，所以[left, middle - 1]
            } else if (nums[middle] < target) {
                left = middle + 1; // target 在右区间，所以[middle + 1, right]
            } else { // nums[middle] == target
                return middle; // 数组中找到目标值，直接返回下标
            }
        }
        // 未找到目标值
        return -1;
    }
};
```

### 844. 比较含退格的字符串
思路： 模拟退格，双指针/快慢指针在原字符串上直接修改，比较结果。  
时间复杂度： O(n)
```c++
class Solution {
   public:
    bool backspaceCompare(string s, string t) {
        int sLen = processString(s);
        int tLen = processString(t);

        // 长度不同直接返回false
        if (sLen != tLen) return false;

        // 比较有效部分
        for (int i = 0; i < sLen; i++) {
            if (s[i] != t[i]) return false;
        }
        return true;
    }

   private:
    int processString(string& str) {
        int slow = 0;
        for (int fast = 0; fast < str.size(); fast++) {
            if (str[fast] == '#') {
                // 避免越界：只有slow > 0时才退格
                if (slow > 0) {
                    slow--;
                }
            } else {
                str[slow] = str[fast];
                slow++;
            }
        }
        return slow;  // 返回有效长度
    }
};
```

### 977. 有序数组的平方
思路： 双指针从两端开始，比较绝对值大的放到新数组末尾，逆序填充。  
时间复杂度： O(n)
```c++
class Solution {
   public:
    vector<int> sortedSquares(vector<int>& nums) {
        vector<int> a(nums.size()); //!!注意声明数组的方法
        int l = 0, r = nums.size() - 1;
        for (int i = nums.size() - 1; i >= 0; i--) {
            if (nums[l] * nums[l] >= nums[r] * nums[r]) {
                a[i] = nums[l] * nums[l];
                l++;
            } else {
                a[i] = nums[r] * nums[r];
                r--;
            }
        }
        return a;
    }
};
```