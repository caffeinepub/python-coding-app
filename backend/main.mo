import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Difficulty = {
    #Beginner;
    #Intermediate;
    #Advanced;
  };

  type Lesson = {
    id : Nat;
    title : Text;
    description : Text;
    codeSnippet : Text;
    difficulty : Difficulty;
  };

  module Lesson {
    public func compare(lesson1 : Lesson, lesson2 : Lesson) : Order.Order {
      Text.compare(lesson1.title, lesson2.title);
    };
  };

  let lessons = Map.empty<Nat, Lesson>();
  let userProgress = Map.empty<Principal, Set.Set<Nat>>();

  var nextLessonId = 1;

  let prePopulatedLessons : [Lesson] = [
    {
      id = 0;
      title = "Variables and Data Types";
      description = "Learn how to declare variables and use different data types in Python.";
      codeSnippet = "x = 10\ntext = 'Hello, World!'\npi = 3.14";
      difficulty = #Beginner;
    },
    {
      id = 1;
      title = "While Loops";
      description = "Understand how to use while loops for repetitive tasks.";
      codeSnippet = "count = 0\nwhile count < 5:\n    print(count)\n    count += 1";
      difficulty = #Beginner;
    },
    {
      id = 2;
      title = "Functions";
      description = "Define and call functions to organize your code.";
      codeSnippet = "def add(a, b):\n    return a + b\n\nresult = add(5, 3)";
      difficulty = #Beginner;
    },
    {
      id = 3;
      title = "List Comprehensions";
      description = "Create new lists using list comprehensions.";
      codeSnippet = "numbers = [1, 2, 3, 4]\nsquared = [x**2 for x in numbers]";
      difficulty = #Intermediate;
    },
    {
      id = 4;
      title = "Dictionaries";
      description = "Store key-value pairs using dictionaries.";
      codeSnippet = "person = {'name': 'Alice', 'age': 30}\nprint(person['name'])";
      difficulty = #Intermediate;
    },
    {
      id = 5;
      title = "Classes and Objects";
      description = "Create custom classes to represent real-world objects.";
      codeSnippet =
        "class Car:\n    def __init__(self, brand):\n        self.brand = brand\nmy_car = Car('Toyota')";
      difficulty = #Intermediate;
    },
    {
      id = 6;
      title = "Error Handling";
      description = "Handle exceptions using try-except blocks.";
      codeSnippet = "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')";
      difficulty = #Advanced;
    },
    {
      id = 7;
      title = "File I/O";
      description = "Read from and write to files in Python.";
      codeSnippet = "with open('data.txt', 'w') as file:\n    file.write('Hello, File!')";
      difficulty = #Advanced;
    },
    {
      id = 8;
      title = "String Manipulation";
      description = "Learn how to manipulate and format strings in Python.";
      codeSnippet = "name = 'john'\ncapitalized = name.capitalize()\nprint(f'Hello, {capitalized}!')";
      difficulty = #Beginner;
    },
    {
      id = 9;
      title = "Conditional Statements";
      description = "Understand how to use if, elif, and else statements.";
      codeSnippet = "x = 10\nif x > 5:\n    print('Greater than 5')\nelif x == 5:\n    print('Equals 5')\nelse:\n    print('Less than 5')";
      difficulty = #Beginner;
    },
    {
      id = 10;
      title = "Tuples and Sets";
      description = "Learn about tuples and sets and their use cases.";
      codeSnippet = "my_tuple = (1, 2, 3)\nmy_set = {1, 2, 3, 3}\nprint(my_set)";
      difficulty = #Intermediate;
    },
    {
      id = 11;
      title = "Lambda Functions";
      description = "Create anonymous functions using the lambda keyword.";
      codeSnippet = "add = lambda x, y: x + y\nprint(add(5, 3))";
      difficulty = #Intermediate;
    },
    {
      id = 12;
      title = "Regular Expressions";
      description = "Use regex for pattern matching and string validation.";
      codeSnippet = "import re\npattern = r'\\d+'\nresult = re.findall(pattern, 'abc123')";
      difficulty = #Advanced;
    },
    {
      id = 13;
      title = "List Slicing";
      description = "Manipulate lists using slicing techniques.";
      codeSnippet = "numbers = [1, 2, 3, 4, 5]\nsublist = numbers[1:4]";
      difficulty = #Beginner;
    },
    {
      id = 14;
      title = "Class Inheritance";
      description = "Understand how to create subclasses and use inheritance.";
      codeSnippet = "class Animal:\n    def speak(self):\n        print('Animal speaks')\nclass Dog(Animal):\n    def bark(self):\n        print('Woof!')";
      difficulty = #Advanced;
    },
    {
      id = 15;
      title = "List Methods";
      description = "Use built-in list methods to manipulate lists.";
      codeSnippet = "numbers = [1, 2, 3]\nnumbers.append(4)\nnumbers.sort()";
      difficulty = #Beginner;
    },
  ];

  for (lesson in prePopulatedLessons.values()) {
    lessons.add(lesson.id, lesson);
    nextLessonId += 1;
  };

  public query ({ caller }) func listAllLessons() : async [Lesson] {
    lessons.values().toArray().sort();
  };

  public query ({ caller }) func getLessonById(id : Nat) : async ?Lesson {
    lessons.get(id);
  };

  public shared ({ caller }) func addLesson(title : Text, description : Text, codeSnippet : Text, difficulty : Difficulty) : async Nat {
    let lessonId = nextLessonId;
    let newLesson : Lesson = {
      id = lessonId;
      title;
      description;
      codeSnippet;
      difficulty;
    };
    lessons.add(lessonId, newLesson);
    nextLessonId += 1;
    lessonId;
  };

  public shared ({ caller }) func markComplete(lessonId : Nat) : async () {
    if (not lessons.containsKey(lessonId)) {
      Runtime.trap("Lesson does not exist");
    };
    let progress = switch (userProgress.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?existing) { existing };
    };
    progress.add(lessonId);
    userProgress.add(caller, progress);
  };

  public query ({ caller }) func getProgress() : async [Nat] {
    switch (userProgress.get(caller)) {
      case (null) { [] };
      case (?progress) {
        progress.values().toArray();
      };
    };
  };
};
