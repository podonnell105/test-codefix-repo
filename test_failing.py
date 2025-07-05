def failing_function():
    return 1 / 0  # This will cause division by zero

def test_failing():
    assert failing_function() == 0  # This test will fail
    print("This should never print")
def test_division_by_zero():
    result = 1 / 0
    assert result == 0
looolllll