## 📝 Reviews & Feedback

We value your feedback! Help us improve by sharing your experience with the package:

[📋 Submit Review via Google Form](https://docs.google.com/forms/d/e/1FAIpQLScgQX8dblYi_Bn4tNrUUTcc_tngZo5lmTX5oE9X3OkeizBUcQ/viewform?usp=header)

Your feedback helps make this package better for everyone in the Flutter community. Let us know what features you love and what we can improve!


# 🚀 Flutter Bloc Generator
[✨ NOW WITH VSCODE EXTENSION! ✨](https://marketplace.visualstudio.com/items?itemName=NavaneethKrishna.fbloc-event-gen)

Get the "Fbloc Event Gen" extension from Visual Studio Marketplace to supercharge your development workflow!

Too much Unwanted freezed Bloc code... ??

Generate All state, event and even bloc code from a SINGLE VARIABLE

Update State with without having to Rememeber all those events.. in a single context.Set.. Fn()

With all options to CUSTOMISE your bloc and event code with out hastle

Then This is the Package u will ever need... 

A powerful code generation package that supercharges your Flutter Bloc implementation with zero boilerplate! Generate events, states, and utilities automatically.

![state image Placeholder](./images/basestate.png)

![calling event image place holder](./images/callingevent.png)

![event image place holder](./images/event.png)


## 📚 Table of Contents
- [Installation](#-installation)
- [Features](#-features)
- [Usage](#-usage)
  - [@GenerateEvents](#-generateevents)
  - [@GenerateStates](#-generatestates)
- [Examples](#-examples)
- [Migration Guide](#-migration-guide)
- [Contributing](#-contributing)
- [License](#-license)

## 📦 Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  fbloc_event_gen: ^3.2.6

dev_dependencies:
  build_runner: ^2.4.6
```

Run:
```bash
flutter pub get
```

## ✨ Features

- 🎯 **Two Powerful Annotations**
  - `@GenerateEvents` - Generate events from factory constructors
  - `@GenerateStates` - Generate complete state management code
- 🔄 **Automatic Generation**
  - Type-safe events and states
  - BuildContext extensions
  - Immutable state updates
- 🛡️ **Built-in Safety**
  - Null safety support
  - Equatable implementation
  - Type checking

## 🎯 Usage


### @GenerateStates

Use `@GenerateStates` for complete state management generation. Define your state variables in the abstract class in the following format.

```dart
part of 'example_bloc.dart';

@generateStates
abstract class _$$ExampleState {
  final bool isLoading = false;
  final int counter = 0;
  final String? data = "You have pushed the button this many times:";
  final String? dss = null;
  final List<String> listNm = List.generate(10, (index) => 'item $index');
  final Map<String, int> mapgenerate = Map<String, int>.fromEntries(
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        .map((e) => MapEntry<String, int>(e, int.parse(e))),
  );
  final Map<String?, String?> list = {};
  final List<bool> selectedDays = [];
  final Map<dynamic, dynamic>? test = {};
}
```

### @GenerateEvents

Use `@GenerateEvents` when you need event-only generation. Perfect for defining bloc events through factory constructors.

```dart
import 'package:flutter_bloc_generator/annotations.dart';

@generateEvents
abstract class ExampleEvent extends Equatable {
  const ExampleEvent();
  
   const factory ExampleEvent.userLoggedIn({required String userId,required String token,
   bool? rememberMe,}) = UserLoggedIn;
  
  const factory ExampleEvent.updateProfile({required String user,}) = UpdateProfile;
  
  const factory ExampleEvent.logOut() = LogOut;
}
```


### Implementation Example

#### Widget Usage

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Traditional way
    BlocProvider.of<ExampleBloc>(context).add(
      UpdateCounterEvent(counter: 42)
    );

    // Using generated extension (Cleaner!)
    context.setExampleBlocState(
      counter: 42
    );
  }
}
```

#### Bloc Class

```dart
class ExampleBloc extends Bloc<ExampleEvent, ExampleState> {
  ExampleBloc() : super(ExampleState.initial()) {
    ExampleState.registerEvents(this);
    on<UserLoggedIn>(_onUserLoggedIn);
    on<UpdateProfile>(_onUpdateProfile); 
    on<LogOut>(_onLogOut);
  }   
  void _onUserLoggedIn(UserLoggedIn event, Emitter<ExampleState> emit) {
    emit(state.copyWith(isLoading: true));
  }

  void _onUpdateProfile(UpdateProfile event, Emitter<ExampleState> emit) {
    emit(state.copyWith(isLoading: true));
  } 
  void _onLogOut(LogOut event, Emitter<ExampleState> emit) {
    emit(state.copyWith(isLoading: true));
  }
}
```

## 🔍 Generated Code Examples

### @GenerateEvents Generated Code

```dart
// **************************************************************************
// EventGenerator
// **************************************************************************

class UserLoggedIn extends ExampleEvent {
  final String userId;
  final String token;
  final bool? rememberMe;

  const UserLoggedIn(
      {required this.userId, required this.token, this.rememberMe});

  @override
  List<Object?> get props => [userId, token, rememberMe];
}

class UpdateProfile extends ExampleEvent {
  final String user;

  const UpdateProfile({required this.user});

  @override
  List<Object?> get props => [user];
}

class LogOut extends ExampleEvent {
  const LogOut();

  @override
  List<Object?> get props => [];
}
```

### @GenerateStates Generated Code

```dart
// **************************************************************************
// StateGenerator
// **************************************************************************

// Events Generated for corresponding states in State Class
class UpdateIsLoadingEvent extends ExampleEvent {
  final bool isLoading;
  const UpdateIsLoadingEvent({required this.isLoading});

  @override
  List<Object?> get props => [isLoading];
}

class UpdateCounterEvent extends ExampleEvent {
  final int counter;
  const UpdateCounterEvent({required this.counter});

  @override
  List<Object?> get props => [counter];
}

/// A state class that represents the complete state of the ExampleBloc.
/// This class is immutable and extends Equatable for value comparison.
class ExampleState extends Equatable {
  /// Indicates whether the bloc is currently processing an operation
  final bool isLoading;
  
  /// Counter value for tracking state changes
  final int counter;
  
  /// Optional data string that can be displayed to the user
  final String? data;
  
  /// Optional secondary data string
  final String? dss;
  
  /// List of string items
  final List<String> listNm;
  
  /// Map containing string keys and integer values
  final Map<String, int> mapgenerate;
  
  /// Map with nullable string keys and values
  final Map<String?, String?> list;
  
  /// List of boolean values representing selected days
  final List<bool> selectedDays;
  
  /// Optional map for storing dynamic key-value pairs
  final Map<dynamic, dynamic>? test;

  /// Creates a new instance of ExampleState with the given parameters.
  /// All parameters except [data], [dss], and [test] are required.
  const ExampleState({
      required this.isLoading,
      required this.counter,
      this.data,
      this.dss,
      required this.listNm,
      required this.mapgenerate,
      required this.list,
      required this.selectedDays,
      this.test});

  /// Creates the initial state of the ExampleBloc.
  /// This method sets up default values for all state properties.
  static ExampleState initial() {
    return ExampleState(
        isLoading: false,
        counter: 0,
        data: "You have pushed the button this many times:",
        dss: null,
        listNm: List.generate(10, (index) => 'item $index'),
        mapgenerate: Map<String, int>.fromEntries(
          ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
              .map((e) => MapEntry<String, int>(e, int.parse(e))),
        ),
        list: {},
        selectedDays: [],
        test: {});
  }

  /// Creates a copy of this state with the given parameters replaced.
  /// If a parameter is not provided, the value from the current state is used.
  ExampleState copyWith({
      bool? isLoading,
      int? counter,
      String? data,
      String? dss,
      List<String>? listNm,
      Map<String, int>? mapgenerate,
      Map<String?, String?>? list,
      List<bool>? selectedDays,
      Map<dynamic, dynamic>? test}) {
    return ExampleState(
        isLoading: isLoading ?? this.isLoading,
        counter: counter ?? this.counter,
        data: data ?? this.data,
        dss: dss ?? this.dss,
        listNm: listNm ?? this.listNm,
        mapgenerate: mapgenerate ?? this.mapgenerate,
        list: list ?? this.list,
        selectedDays: selectedDays ?? this.selectedDays,
        test: test ?? this.test);
  }

  /// Creates a copy of this state with the ability to set specific fields to null.
  /// The boolean parameters control whether the corresponding field should be set to null.
  ExampleState copyWithNull({
      bool? isLoading,
      int? counter,
      bool data = false,
      bool dss = false,
      List<String>? listNm,
      Map<String, int>? mapgenerate,
      Map<String?, String?>? list,
      List<bool>? selectedDays,
      bool test = false}) {
    return ExampleState(
        isLoading: isLoading ?? this.isLoading,
        counter: counter ?? this.counter,
        data: data ? null : this.data,
        dss: dss ? null : this.dss,
        listNm: listNm ?? this.listNm,
        mapgenerate: mapgenerate ?? this.mapgenerate,
        list: list ?? this.list,
        selectedDays: selectedDays ?? this.selectedDays,
        test: test ? null : this.test);
  }

  /// Registers all event handlers for the ExampleBloc.
  /// This method sets up the event-to-state mapping for all possible state updates.
  static void registerEvents(ExampleBloc bloc) {
    bloc.on<UpdateIsLoadingEvent>((event, emit) {
      emit(bloc.state.copyWith(isLoading: event.isLoading));
    });

    bloc.on<UpdatecounterEvent>((event, emit) {
      emit(bloc.state.copyWith(counter: event.counter));
    });

    bloc.on<UpdateDataEvent>((event, emit) {
      if (event.data == null) {
        emit(bloc.state.copyWithNull(data: true));
      } else {
        emit(bloc.state.copyWith(data: event.data));
      }
    });

    bloc.on<UpdateDssEvent>((event, emit) {
      if (event.dss == null) {
        emit(bloc.state.copyWithNull(dss: true));
      } else {
        emit(bloc.state.copyWith(dss: event.dss));
      }
    });

    bloc.on<UpdateListNmEvent>((event, emit) {
      emit(bloc.state.copyWith(listNm: event.listNm));
    });

    bloc.on<UpdateMapgenerateEvent>((event, emit) {
      emit(bloc.state.copyWith(mapgenerate: event.mapgenerate));
    });

    bloc.on<UpdateListEvent>((event, emit) {
      emit(bloc.state.copyWith(list: event.list));
    });

    bloc.on<UpdateSelectedDaysEvent>((event, emit) {
      emit(bloc.state.copyWith(selectedDays: event.selectedDays));
    });

    bloc.on<UpdateTestEvent>((event, emit) {
      if (event.test == null) {
        emit(bloc.state.copyWithNull(test: true));
      } else {
        emit(bloc.state.copyWith(test: event.test));
      }
    });
  }

  /// Returns a list of all properties used for equality comparison.
  @override
  List<Object?> get props => [
        isLoading,
        counter,
        data,
        dss,
        listNm,
        mapgenerate,
        list,
        selectedDays,
        test
      ];
}

/// Extension on BuildContext that provides convenient methods for updating the ExampleBloc state.
/// This extension simplifies state updates by providing a single method to update multiple state properties.
extension ExampleBlocContextExtension on BuildContext {
  /// Updates the ExampleBloc state with the provided values.
  /// Only the specified parameters will be updated; others will remain unchanged.
  /// Uses UnspecifiedDataType.instance as a sentinel value to determine which parameters to update.
  void setExampleBlocState({
    Object? isLoading = UnspecifiedDataType.instance,
    Object? counter = UnspecifiedDataType.instance,
    Object? data = UnspecifiedDataType.instance,
    Object? dss = UnspecifiedDataType.instance,
    Object? listNm = UnspecifiedDataType.instance,
    Object? mapgenerate = UnspecifiedDataType.instance,
    Object? list = UnspecifiedDataType.instance,
    Object? selectedDays = UnspecifiedDataType.instance,
    Object? test = UnspecifiedDataType.instance,
  }) {
    final myBloc = read<ExampleBloc>(); // Read the MyBloc instance
    if (isLoading != UnspecifiedDataType.instance) {
      myBloc.add(UpdateIsLoadingEvent(isLoading: isLoading as bool?));
    }

    if (counter != UnspecifiedDataType.instance) {
      myBloc.add(UpdateCounterEvent(counter: counter as int));
    }

    if (data != UnspecifiedDataType.instance) {
      myBloc.add(UpdateDataEvent(data: data as String?));
    }

    if (dss != UnspecifiedDataType.instance) {
      myBloc.add(UpdateDssEvent(dss: dss as String?));
    }

    if (iterable != UnspecifiedDataType.instance) {
      myBloc.add(UpdateIterableEvent(iterable: iterable.cast<String>()));
    }

    if (listNm != UnspecifiedDataType.instance) {
      myBloc.add(UpdateListNmEvent(listNm: listNm.cast<String>()));
    }

    if (mapgenerate != UnspecifiedDataType.instance) {
      myBloc.add(
          UpdateMapgenerateEvent(mapgenerate: mapgenerate.cast<String, int>()));
    }

    if (list != UnspecifiedDataType.instance) {
      myBloc.add(UpdateListEvent(list: list.cast<String?, String?>()));
    }

    if (selectedDays != UnspecifiedDataType.instance) {
      myBloc.add(
          UpdateSelectedDaysEvent(selectedDays: selectedDays.cast<bool>()));
    }

    if (test != UnspecifiedDataType.instance) {
      myBloc.add(UpdateTestEvent(test: test.cast<dynamic, dynamic>()));
    }
  }
}
```


## 🎯 Best Practices

1. **State Variables**
   - Keep state classes focused and minimal
   - Use meaningful variable names
   - Consider nullability carefully

2. **Event Generation**
   - Use descriptive factory constructor names
   - Group related events together
   - Document complex event parameters

3. **State Updates**
   - Prefer extension methods for simple updates
   - Use traditional events for complex logic
   - Keep state immutable

## 🔄 Migration Guide

### 2.0.0 to 3.0.0
- Update annotation imports
- Rename existing state classes to include `_$$` prefix
- Add initial values to state variables
- Run code generation

## 🤝 Contributing

We welcome contributions! Please see our [contributing guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.