import pytest
from calculator import add, multiply, divide, subtract

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_multiply():
    assert multiply(2, 3) == 6
    assert multiply(-2, 3) == -6
    assert multiply(0, 5) == 0

def test_divide():
    assert divide(6, 2) == 3
    assert divide(5, 2) == 2.5
    assert divide(-6, 2) == -3

def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(3, 5) == -2
    assert subtract(0, 0) == 0

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(5, 0)

# This test will FAIL - the function returns a + b but test expects a - b
def test_add_bug():
    assert add(5, 3) == 8  # This should be 8, but we're testing for 2
