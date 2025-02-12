# 🚀 Flutter Bloc Generator

Too much Unwanted freezed Bloc code... ??

Generate All state, event and even bloc code from a SINGLE VARIABLE

Update State with without having to Rememeber all those events.. in a single context.Set.. Fn()

With all options to CUSTOMISE your bloc and event code with out hastle

Then This is the Package u will ever need... 

A powerful code generation package that supercharges your Flutter Bloc implementation with zero boilerplate! Generate events, states, and utilities automatically.

![state image Placeholder](https://raw.githubusercontent.com/navaneethkrishnaindeed/bloc_gen/refs/heads/main/images/basestate.png)

![calling event image place holder](https://raw.githubusercontent.com/navaneethkrishnaindeed/bloc_gen/refs/heads/main/images/callingevent.png)

![event image place holder](https://raw.githubusercontent.com/navaneethkrishnaindeed/bloc_gen/refs/heads/main/images/event.png)


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
  fbloc_event_gen: ^3.0.3

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

### @GenerateEvents

Use `@GenerateEvents` when you need event-only generation. Perfect for defining bloc events through factory constructors.

```dart
import 'package:flutter_bloc_generator/annotations.dart';

@GenerateEvents
abstract class BaseEvent extends Equatable {
  const BaseEvent();
  
  // Factory constructors define your events
  factory BaseEvent.userLoggedIn({
    required String userId,
    required String token,
    bool? rememberMe,
  });
  
  factory BaseEvent.updateProfile({
    required UserModel user,
  });
  
  factory BaseEvent.logOut();
}
```

#### Generated Code ✨

```dart
// Generated events.g.dart

class UserLoggedIn extends BaseEvent {
  final String userId;
  final String token;
  final bool? rememberMe;

  const UserLoggedIn({
    required this.userId,
    required this.token,
    this.rememberMe,
  });

  @override
  List<Object?> get props => [userId, token, rememberMe];
}

class UpdateProfile extends BaseEvent {
  final UserModel user;

  const UpdateProfile({required this.user});

  @override
  List<Object?> get props => [user];
}

class LogOut extends BaseEvent {
  const LogOut();

  @override
  List<Object?> get props => [];
}
```

### @GenerateStates

Use `@GenerateStates` for complete state management generation. Define your state variables in an abstract class.

```dart
import 'package:flutter_bloc_generator/annotations.dart';

@GenerateStates
abstract class _$$BaseState {
  final bool isAuthenticated = false;
  final bool isLoading = false;
  final UserModel? currentUser = null;
  final List<String> errorMessages = [];
  final AuthStatus authStatus = AuthStatus.initial;
  final Map<String, dynamic> userData = {};
}
```

#### Generated Code ✨

```dart
// Generated state.g.dart

/// 1️⃣ State Class Definition
class BaseState extends Equatable {
  final bool isAuthenticated;
  final bool isLoading;
  final UserModel? currentUser;
  final List<String> errorMessages;
  final AuthStatus authStatus;
  final Map<String, dynamic> userData;

  const BaseState({
    required this.isAuthenticated,
    required this.isLoading,
    this.currentUser,
    required this.errorMessages,
    required this.authStatus,
    required this.userData,
  });

  /// 2️⃣ State Mutation Utilities
  BaseState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    UserModel? currentUser,
    List<String>? errorMessages,
    AuthStatus? authStatus,
    Map<String, dynamic>? userData,
  }) {
    return BaseState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      currentUser: currentUser ?? this.currentUser,
      errorMessages: errorMessages ?? this.errorMessages,
      authStatus: authStatus ?? this.authStatus,
      userData: userData ?? this.userData,
    );
  }

  /// 3️⃣ Initial State Factory
  static BaseState initial() {
    return BaseState(
      isAuthenticated: false,
      isLoading: false,
      currentUser: null,
      errorMessages: [],
      authStatus: AuthStatus.initial,
      userData: {},
    );
  }

  /// 4️⃣ State Update Events
  class UpdateIsAuthenticatedEvent extends BaseEvent {
    final bool isAuthenticated;
    const UpdateIsAuthenticatedEvent({required this.isAuthenticated});
    @override
    List<Object?> get props => [isAuthenticated];
  }
  // ... events for each state variable

  /// 5️⃣ Event Handlers Registration
  static void registerEvents(BaseBloc bloc) {
    bloc.on<UpdateIsAuthenticatedEvent>((event, emit) {
      emit(bloc.state.copyWith(isAuthenticated: event.isAuthenticated));
    });
    bloc.on<UpdateIsLoadingEvent>((event, emit) {
      emit(bloc.state.copyWith(isLoading: event.isLoading));
    });
    // ... handlers for all events
  }

  /// 6️⃣ Equatable Implementation
  @override
  List<Object?> get props => [
    isAuthenticated,
    isLoading,
    currentUser,
    errorMessages,
    authStatus,
    userData,
  ];
}

/// 7️⃣ BuildContext Extensions
extension BaseBlocContextExtension on BuildContext {
  void setBaseBlocState({
    bool? isAuthenticated,
    bool? isLoading,
    UserModel? currentUser,
    List<String>? errorMessages,
    AuthStatus? authStatus,
    Map<String, dynamic>? userData,
  }) {
    final bloc = read<BaseBloc>();
    if (isAuthenticated != null) {
      bloc.add(UpdateIsAuthenticatedEvent(isAuthenticated: isAuthenticated));
    }
    if (isLoading != null) {
      bloc.add(UpdateIsLoadingEvent(isLoading: isLoading));
    }
    // ... handlers for all state updates
  }
}
```

## 🛠️ Implementation

### Bloc Class

```dart
class BaseBloc extends Bloc<BaseEvent, BaseState> {
  BaseBloc() : super(BaseState.initial()) {
    // Register all event handlers automatically
    BaseState.registerEvents(this);
    
    // Add your custom event handlers
    on<UserLoggedIn>(_onUserLoggedIn);
  }

  Future<void> _onUserLoggedIn(
    UserLoggedIn event,
    Emitter<BaseState> emit,
  ) async {
    emit(state.copyWith(isLoading: true));
    // ... authentication logic
    emit(state.copyWith(
      isLoading: false,
      isAuthenticated: true,
    ));
  }
}
```

### Widget Usage

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Traditional way
    context.read<BaseBloc>().add(
      UpdateProfile(user: updatedUser)
    );

    // Using generated extension (Cleaner!)
    context.setBaseBlocState(
      isLoading: true,
      currentUser: updatedUser,
      authStatus: AuthStatus.authenticated,
    );
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